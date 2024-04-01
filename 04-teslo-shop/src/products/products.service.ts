import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, NotImplementedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos';
import {validate as isUUID} from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('Products Service');
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  private handleDbExceptions(error: any): void {
      if (error.code === '23505')
        throw new BadRequestException(error.details);
      
      this.logger.error(error);
      throw new InternalServerErrorException('Insertion fails');
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = this.productRepository.create(createProductDto);
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    const {limit = 10, offset = 0} = paginationDto;

    return this.productRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findByOne(term: string): Promise<Product> {
    const product: Product = await this.productRepository.findOne({
      where: [
        {id: term},
        {slug: term},
        {title: term},
      ],
    });

    if (!product)
      throw new NotFoundException(`Product with ${term} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findByOne(id);
    try {
      
    } catch (error) {
      this.handleDbExceptions(error);
    }

    throw new NotImplementedException();
  }

  async remove(id: string): Promise<Product> {
    const product = this.findByOne(id);
    await this.productRepository.delete({id});
    return product;
  }
}
