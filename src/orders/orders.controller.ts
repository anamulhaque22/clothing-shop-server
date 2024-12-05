import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/roles/roles.decorators';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { InfinityPaginationResponseDto } from 'src/utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { Order } from './domain/order';
import { AllOrdersResponseDto } from './dto/all-orders-response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDetailsResponseDto } from './dto/order-details-reponse.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ORDER_STATUS } from './orders.enum';
import { OrdersService } from './orders.service';

@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController {
  constructor(private readonly ordresService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Body() data: CreateOrderDto,
    @Request() request,
  ): Promise<Order> {
    return this.ordresService.createOrder({ ...data, userId: request.user.id });
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryOrdersDto,
    @Request() request,
  ): Promise<InfinityPaginationResponseDto<AllOrdersResponseDto>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 10;

    return infinityPagination(
      await this.ordresService.findManyWithPagination({
        user: {
          id: request.user.id,
          role: request.user.role,
        },
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        search: query?.search,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: Order['id'],
    @Request() request,
  ): Promise<OrderDetailsResponseDto> {
    return this.ordresService.findOne(id, {
      id: request.user.id,
      role: request.user.role,
    });
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOrderStatus(
    @Param('id') id: Order['id'],
    @Body() data: UpdateOrderStatusDto,
    @Request() request,
  ): Promise<void> {
    return await this.ordresService.updateOrderStatus(
      id,
      ORDER_STATUS[data.orderStatus],
      {
        id: request.user.id,
        role: request.user.role,
      },
    );
  }
}
