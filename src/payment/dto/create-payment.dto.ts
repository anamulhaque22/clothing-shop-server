import { PAYMENT_PROVIDER } from 'src/stripe/payment-provider.enum';

export class CreatePaymentDto {
  amount: number;
  transaction_id: string;
  orderId?: number;
  payment_provider: PAYMENT_PROVIDER;
}
