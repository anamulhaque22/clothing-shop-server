import { Address } from 'src/addresses/domain/address';
import { User } from 'src/users/domain/user';

export class OrderItem {
  id?: number;
  productId: number;
  quantity: number;
  price?: number; // order pleaceing time price will be null and after validation it will be set from product price
  size: string;
  color: string;
  colorCode: string;
}

export class Order {
  id: number;
  user: User;
  orderItems: OrderItem[];
  totalAmount: number;
  billingAddress: Address;
  shippingAddress: Address;
  status: string;
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
