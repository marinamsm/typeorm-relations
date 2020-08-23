import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

interface IOrdersProductsData {
  product_id: string;
  price: number;
  quantity: number;
  product?: Product;
  order_id?: string;
  order?: Order;
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository') private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Cliente inválido');
    }

    console.log('BOUGHT...', products);

    let productsFetched = [];

    try {
      productsFetched = await this.productsRepository.updateQuantity(products);
    } catch (error) {
      throw new AppError(error.message);
    }

    console.log('lengths: ', productsFetched.length, products.length);

    if (productsFetched.length !== products.length) {
      throw new AppError('Produto não encontrado ou sem estoque');
    }

    console.log('AFTER UPDATE', productsFetched);

    const orderProductsRelation: IOrdersProductsData[] = [];

    /* eslint-disable no-param-reassign */
    productsFetched.forEach(product => {
      const productBought = products.find(prod => prod.id === product.id);
      const quantityBought = productBought?.quantity;

      if (quantityBought) {
        orderProductsRelation.push({
          product_id: product.id,
          price: product.price,
          quantity: quantityBought,
        });
      }
    });

    return this.ordersRepository.create({
      customer,
      products: orderProductsRelation,
    });
  }
}

export default CreateOrderService;
