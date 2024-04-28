import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, NotImplementedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos';
import {validate as isUUID} from 'uuid';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('Products Service');
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  private handleDbExceptions(error: any): void {
      if (error.code === '23505')
        throw new BadRequestException(error.details);
      
      this.logger.error(error);
      throw new InternalServerErrorException('Insertion fails');
  }

  async create(createProductDto: CreateProductDto): Promise<any> {
    try {
      const {images = [], ...productDetails} = createProductDto
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((url: string) => this.productImageRepository.create({url})),
      });

      await this.productRepository.save(product);
      return {...product, images}
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<any> {
    const {limit = 10, offset = 0} = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });
  
    return products.map(({images, ...productInfo}) => ({
      ...productInfo,
      images: images.map((image) => image.url)
    }))
  }

  async findOne(term: string): Promise<Product> {
    let product: Product
    
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({id: term})
    } else {
      product= await this.productRepository.findOne({
        where: [
          {slug: term},
          {title: term},
        ],
      });
    }

    if (!product)
      throw new NotFoundException(`Product with ${term} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const {images, ...toUpdate} = updateProductDto;
    const product = await this.productRepository.preload({id, ...toUpdate})
    if(!product) throw new NotFoundException(`Product with id ${id} not found`)

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: {id}})
        product.images = images.map(image => this.productImageRepository.create({url: image}));
      }
      await queryRunner.manager.save(product)
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDbExceptions(error)
    }

    return product;
  }

  async remove(id: string): Promise<Product> {
    const product = this.findOne(id);
    await this.productRepository.delete({id});
    return product;
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDbExceptions(error)
    }
  }
}
