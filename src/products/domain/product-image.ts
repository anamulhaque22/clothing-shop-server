import { Expose } from 'class-transformer';

export class ProductImage {
  id: number;

  @Expose({ groups: ['admin'] })
  publicId: string;

  imageUrl: string;
}
