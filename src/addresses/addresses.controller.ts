import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/roles/roles.decorators';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { NullableType } from 'src/utils/types/nullable.type';
import { AddressesService } from './addresses.service';
import { Address } from './domain/address';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Roles(RoleEnum.user, RoleEnum.admin)
@UseGuards(AuthGuard, RolesGuard)
@Controller({
  path: '/addresses',
  version: '1',
})
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: CreateAddressDto,
    @Request() request,
  ): Promise<Address> {
    return this.addressesService.create(data, request.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Address[]> {
    return this.addressesService.findAll();
  }

  @Get('user/address')
  @HttpCode(HttpStatus.OK)
  async findByUserId(@Request() request): Promise<Address[]> {
    return this.addressesService.findByUserId(request.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => new UnprocessableEntityException(),
      }),
    )
    id: Address['id'],
  ): Promise<NullableType<Address>> {
    return this.addressesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: Address['id'],
    @Body() data: UpdateAddressDto,
  ): Promise<Address> {
    return this.addressesService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: Address['id']): Promise<void> {
    return this.addressesService.remove(id);
  }
}
