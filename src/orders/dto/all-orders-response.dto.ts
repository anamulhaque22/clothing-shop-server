import { IsDate, IsNumber, IsString } from 'class-validator';
import { Payment } from 'src/payment/domain/payment';
import { User } from 'src/users/domain/user';

export class AllOrdersResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;

  @IsNumber()
  totalAmount: number;

  @IsString()
  status: string;

  @IsString()
  payment: Pick<Payment, 'id' | 'status'>;

  @IsDate()
  createdAt: Date;
}
