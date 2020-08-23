import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const orderShowService = container.resolve(FindOrderService);

    const order = await orderShowService.execute({ id });

    return response.status(200).json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products }: IRequest = request.body;

    const orderCreationService = container.resolve(CreateOrderService);

    const newOrder = await orderCreationService.execute({
      customer_id,
      products,
    });

    return response.status(200).json(newOrder);
  }
}
