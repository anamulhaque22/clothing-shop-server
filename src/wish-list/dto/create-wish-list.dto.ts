import { IsNotEmpty } from 'class-validator';

export class CreateWishListDto {
  //   @IsNotEmpty()
  //   user: User['id'];

  @IsNotEmpty()
  productId: number;
}
