import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  @Column('int4')
  quantity: number;

  @OneToMany(() => OrdersProducts, order_product => order_product.product, {
    cascade: true,
  })
  order_products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
