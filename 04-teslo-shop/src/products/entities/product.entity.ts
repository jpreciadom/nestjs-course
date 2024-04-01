import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  title: string;

  @Column({
    type: 'float',
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @Column({
    type: 'integer',
    default: 0,
  })
  stock: number;

  @Column({
    type: 'text',
    array: true,
  })
  sizes: string[];

  @Column({
    type: 'text',
  })
  gender: string;

  @BeforeInsert()
  checkSlug() {
    if (!this.slug) {
      this.slug = this.title
    }
  
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll('\'', '');    
  }
}
