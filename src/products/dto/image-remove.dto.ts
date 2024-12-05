import { IsEmpty, IsNumber, IsString } from 'class-validator';

export class ImageRemoveDto {
  @IsString()
  @IsEmpty()
  publicId: string;

  @IsNumber()
  id: number;
}
