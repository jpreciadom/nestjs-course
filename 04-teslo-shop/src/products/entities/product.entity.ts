import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "../../auth/entities";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Product {

  @ApiProperty({
    example: '473d4a8c-0c31-4e0a-9d8d-466d0470f605',
    description: 'Product id',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-shirt Teslo',
    description: 'Product title',
    uniqueItems: true,
  })
  @Column({
    type: 'text',
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 50.99,
    description: 'Product price',
  })
  @Column({
    type: 'float',
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'lorem ipsum',
    description: 'Product description',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product SLUG - for SEO',
    uniqueItems: true,
  })
  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  @Column({
    type: 'integer',
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL'],
    description: 'Product sizes',
  })
  @Column({
    type: 'text',
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'Women',
    description: 'Product Gender',
  })
  @Column({
    type: 'text',
  })
  gender: string;

  @ApiProperty({
    example: ['T-Shirt'],
    description: 'Product tags',
  })
  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  tags: string[];

  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    {cascade: true, eager: true},
  )
  images?: ProductImage[]

  @ManyToOne(
    () => User,
    (user) => user.products,
    {eager: true},
  )
  @JoinColumn({
      name: 'user_id',
      foreignKeyConstraintName: 'user_product_fk',
  })
  user: User

  @BeforeInsert()
  @BeforeUpdate()
  checkSlug() {
    if (!this.slug)
      this.slug = this.title
  
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll('\'', '');    
  }
}
