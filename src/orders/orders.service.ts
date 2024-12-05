import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddressType } from 'src/addresses/address-type.enum';
import { AddressesService } from 'src/addresses/addresses.service';
import { Address } from 'src/addresses/domain/address';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { QueryRunnerFactory } from 'src/database/query-runner-factory';
import { PAYMENT_STATUS } from 'src/payment/payment-status.enum';
import { PaymentService } from 'src/payment/payment.service';
import { ProductsService } from 'src/products/products.service';
import { RoleEnum } from 'src/roles/roles.enum';
import { PAYMENT_PROVIDER } from 'src/stripe/payment-provider.enum';
import { User } from 'src/users/domain/user';
import { UsersService } from 'src/users/users.service';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Order } from './domain/order';
import { AllOrdersResponseDto } from './dto/all-orders-response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto, SortOrderDto } from './dto/query-orders.dto';
import { OrderRepository } from './infrastructure/order.repository';
import { ORDER_STATUS } from './orders.enum';

@Injectable()
export class OrdersService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderRepo: OrderRepository,
    private readonly productsService: ProductsService,
    private readonly userService: UsersService,
    private readonly addressesService: AddressesService,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  async createOrder(
    data: CreateOrderDto & {
      userId: User['id'];
    },
  ): Promise<Order> {
    const user = await this.userService.findById(data.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // checking the product quantity and product variation like size and color and size quantity, color quantity is available or not
    const products = await this.orderItemsValidation(data.orderItems);

    //calculating the total amount
    const totalAmount: number = this.calculateTotalAmount(
      data.orderItems,
      products,
    );

    const { billingAddress, shippingAddress } =
      await this.checkingBillingAndShippingAddress({
        billingAddressId: data.billingAddressId,
        billingAddress: data.billingAddress,
        shippingAddressId: data.shippingAddressId,
        shippingAddress: data.shippingAddress,
        userId: data.userId,
      });

    let newOrderItems = data.orderItems.map((item) => {
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: products.find((p) => p.id === item.productId).sellPrice,
        size: products
          .find((p) => p.id === item.productId)
          .sizes.find((s) => s.id === item.size.id).name,

        color: products
          .find((p) => p.id === item.productId)
          .productInfo.find((info) => info.id === item.color.id).colorName,
        colorCode: products
          .find((p) => p.id === item.productId)
          .productInfo.find((info) => info.id === item.color.id).colorCode,
      };
    });

    const queryRunner = this.queryRunnerFactory.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.orderRepo.createOrder(
        {
          ...data,
          user,
          status: ORDER_STATUS.PENDING,
          totalAmount,
          billingAddress,
          shippingAddress,
          orderItems: newOrderItems,
        },
        queryRunner,
      );

      if (order) {
        for (const product of products) {
          // updating the product quantity
          product.quantity -= data.orderItems.find(
            (item) => item.productId === product.id,
          ).quantity;

          // updating the product stock for color and size
          const orderdProduct = data.orderItems.find(
            (oi) => oi.productId === product.id,
          );

          const productInfo = product.productInfo.find(
            (pf) => pf.id === orderdProduct.color.id,
          );
          const size = product.sizes.find(
            (s) => s.id === orderdProduct.size.id,
          );

          productInfo.colorSizeWiseQuantity[size.name.toLowerCase()] -=
            orderdProduct.quantity;

          productInfo.colorWiseQuantity -= orderdProduct.quantity;

          await this.orderRepo.updateProductStock(
            product.id,
            {
              ...product,
              quantity: product.quantity,
              productInfo: product.productInfo,
            },
            queryRunner,
          );
        }
      }

      switch (data.paymentType) {
        case PAYMENT_PROVIDER.STRIPE:
          const payment = await this.paymentService.getPaymentByTransactionId(
            data.transaction_id,
            queryRunner,
          );
          if (!payment) {
            throw new NotFoundException('Payment not found');
          }

          await this.paymentService.updatePayment(
            data.transaction_id,
            {
              orderId: order.id,
              status: PAYMENT_STATUS.SUCCESS,
            },
            queryRunner,
          );
          break;
        case PAYMENT_PROVIDER.COD:
          await this.paymentService.createPayment(
            {
              amount: totalAmount,
              orderId: order.id,
              transaction_id: 'COD',
              payment_provider: PAYMENT_PROVIDER.COD,
            },
            queryRunner,
          );
          break;
        default:
          throw new BadRequestException('Invalid payment type');
      }

      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Order processing failed');
    } finally {
      await queryRunner.release();
    }
  }

  findManyWithPagination({
    user,
    filterOptions,
    sortOptions,
    search,
    paginationOptions,
  }: {
    user: {
      id: User['id'];
      role: User['role'];
    };
    filterOptions?: FilterOrderDto | null;
    sortOptions?: SortOrderDto[] | null;
    search?: string | null;
    paginationOptions: IPaginationOptions;
  }): Promise<AllOrdersResponseDto[]> {
    if (Number(user.role.id) === Number(RoleEnum.user)) {
      return this.orderRepo.findManyWithPagination({
        userId: user.id,
        filterOptions,
        sortOptions,
        search,
        paginationOptions,
      });
    }
    // if the user is admin then return all the orders
    return this.orderRepo.findManyWithPagination({
      filterOptions,
      sortOptions,
      search,
      paginationOptions,
    });
  }

  async findOne(id: Order['id'], user: { id: User['id']; role: User['role'] }) {
    const result = await this.orderRepo.findOne(id, user);
    if (!result) {
      throw new NotFoundException(`Order not found with id: ${id}`);
    }
    return result;
  }

  async updateOrderStatus(
    id: Order['id'],
    orderStatus: ORDER_STATUS,
    user: { id: User['id']; role: User['role'] },
  ): Promise<void> {
    const order = await this.orderRepo.findOne(id, user);
    if (!order) {
      throw new NotFoundException(`Order not found with id: ${id}`);
    }
    let data;
    if (
      order.successPayment?.payment_provider === PAYMENT_PROVIDER.COD &&
      orderStatus === ORDER_STATUS.COMPLETED
    ) {
      data = await this.orderRepo.updateOrderStatus(id, {
        status: orderStatus,
        paymentStatus: PAYMENT_STATUS.SUCCESS,
      });
      return;
    } else {
      data = await this.orderRepo.updateOrderStatus(id, {
        status: orderStatus,
        paymentStatus: PAYMENT_STATUS[order.successPayment?.status],
      });
      return;
    }
  }

  calculateTotalAmount(orderItems, products) {
    let totalAmount = 0;
    orderItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      totalAmount += product.sellPrice * item.quantity;
    });

    return totalAmount;
  }

  async orderItemsValidation(orderItems) {
    const products = await Promise.all(
      orderItems.map(async (item) => {
        const product = await this.productsService.findOne(item.productId);

        if (!product) {
          throw new NotFoundException(
            `Product not found with id: ${item.productId}`,
          );
        }

        if (product.quantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product id: ${item.productId}`,
          );
        }

        const isSizeExits = product.sizes.filter(
          (size) => size.id === item.size?.id,
        );

        if (!isSizeExits.length) {
          throw new BadRequestException(
            `Size not found for product id: ${item.productId}`,
          );
        }

        const colorExits = product.productInfo.filter(
          (info) => info.id === item.color?.id,
        );

        if (!colorExits.length) {
          throw new BadRequestException(
            `Color not found for product id: ${item.productId}`,
          );
        }

        if (
          colorExits[0]?.colorSizeWiseQuantity[
            isSizeExits[0].name.toLowerCase()
          ] < item.quantity
        ) {
          throw new BadRequestException(
            `Insufficient stock for color: ${colorExits[0]?.colorCode} and product id: ${item.productId}`,
          );
        }

        return product;
      }),
    );

    return products;
  }

  async checkingBillingAndShippingAddress(data: {
    billingAddressId?: number;
    billingAddress?: CreateAddressDto;
    shippingAddressId?: number;
    shippingAddress?: CreateAddressDto;
    userId: User['id'];
  }) {
    //user must have to provide the billing address or billing address id, if billing address id is provided then we will use that address otherwise we will create billing address. shipping address is optional, if shipping address id is provided then we will use that address otherwise we will use billing address for shipping address

    let billingAddress = new Address();
    if (data.billingAddressId) {
      const address = await this.addressesService.findOne(
        data.billingAddressId,
      );
      if (!address) {
        throw new NotFoundException('Billing address not found');
      }
      billingAddress = address;
    } else {
      const address = await this.addressesService.create(
        {
          ...data.billingAddress,
          addressType: AddressType.BILLING,
          isDefaultShipping: false,
          isDefaultBilling: false,
          isOrderAddress: true,
        },
        data.userId,
      );

      billingAddress = address;
    }

    let shippingAddress = new Address();
    if (data.shippingAddressId && !data.shippingAddress) {
      const address = await this.addressesService.findOne(
        data.shippingAddressId,
      );
      if (!address) {
        throw new NotFoundException('Shipping address not found');
      }
      shippingAddress = address;
    } else if (data.shippingAddress && !data.shippingAddressId) {
      const address = await this.addressesService.create(
        {
          ...data.shippingAddress,
          addressType: AddressType.SHIPPING,
          isDefaultShipping: false,
          isDefaultBilling: false,
          isOrderAddress: true,
        },
        data.userId,
      );
      shippingAddress = address;
    } else {
      shippingAddress = billingAddress;
    }

    return { billingAddress, shippingAddress };
  }
}
