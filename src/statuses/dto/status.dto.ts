import { IsNumber } from 'class-validator';
import { Status } from '../domain/status';

export class StatusDto implements Status {
  @IsNumber()
  id: number;
}
