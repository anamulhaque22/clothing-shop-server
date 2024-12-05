import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { WishList } from './domain/wish-list';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { WishListService } from './wish-list.service';

@Controller({
  version: '1',
  path: 'wish-list',
})
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateWishListDto, @Request() request) {
    return this.wishListService.create({
      ...data,
      userId: request.user.id,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() request) {
    return this.wishListService.findAll(request.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() id: WishList['id'], @Request() request) {
    return this.wishListService.remove(request.params.id, request.user.id);
  }
}
