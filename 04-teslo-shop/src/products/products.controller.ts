import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos';
import { Authorize, GetUser } from '../auth/decorators';
import { User } from '../auth/entities';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Authorize()
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<Product> {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<Product[]> {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  async findOne(@Param('term') term: string): Promise<Product> {
    return this.productsService.findOne(term);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<Product> {
    return this.productsService.remove(id);
  }
}
