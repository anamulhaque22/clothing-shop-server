import { PAYMENT_STATUS } from '../payment-status.enum';

export class UpdatePaymentDto {
  amount?: number | null;
  transaction_id?: string | null;
  status?: PAYMENT_STATUS | null;
  orderId?: number | null;
}
