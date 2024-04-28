import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Product,
        (product) => product.images,
        {nullable: false, onDelete: 'CASCADE'},
    )
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'product_image_product_FK',
    })
    product: Product
}