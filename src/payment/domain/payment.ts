import { Order } from 'src/orders/domain/order';

export class Payment {
  id: number;
  amount?: number;
  status: string;
  transaction_id: string;
  order?: Order;
  createdAt?: Date;
  payment_provider?: string | null;
}
