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

    const productsFetched = await this.productsRepository.findAllById(products);

    const orderProductsRelation: IOrdersProductsData[] = [];

    productsFetched.forEach(product => {
      const productBought = products.find(prod => prod.id === product.id);
      const quantityBought = productBought?.quantity;
      orderProductsRelation.push({
        product_id: product.id,
        price: product.price,
        quantity: quantityBought || 0,
      });
    });

    return this.ordersRepository.create({
      customer,
      products: orderProductsRelation,
    });
  }
}

export default CreateOrderService;
