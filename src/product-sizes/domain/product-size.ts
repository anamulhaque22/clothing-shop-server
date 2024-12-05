import { Allow } from 'class-validator';

export class ProductSize {
  @Allow()
  id: number;

  @Allow()
  name?: string;
}
