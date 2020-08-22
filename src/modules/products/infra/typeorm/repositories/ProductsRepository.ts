import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const productObject = this.ormRepository.create({ name, price, quantity });

    return this.ormRepository.save(productObject);
  }

  public async findByName(name: string): Promise<Product | undefined> {
    return this.ormRepository.findOne({ name });
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsIds = products.map(product => product.id);
    return this.ormRepository.find({
      where: {
        id: In(productsIds),
      },
    });
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    interface IProductsMapping {
      [key: string]: number;
    }
    const productsIds: IFindProducts[] = [];
    const productsMap: IProductsMapping = {};

    products.forEach(product => {
      productsIds.push({ id: product.id });

      productsMap[product.id] = product.quantity;
    });

    const currentProducts = await this.findAllById(productsIds);

    /* eslint-disable no-param-reassign */
    currentProducts.forEach(product => {
      if (productsMap[product.id]) {
        product.quantity = productsMap[product.id];
      }
    });

    return this.ormRepository.save(currentProducts);
  }
}

export default ProductsRepository;
