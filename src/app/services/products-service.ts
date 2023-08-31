import { Product } from '@commercetools/platform-sdk';
import { anonymApiRoot } from '../shared/util/client-builder';

class ProductService {
  public static async getAllProducts(): Promise<Product[]> {
    const response = await anonymApiRoot.products().get().execute();
    console.log('responseProduct', response);
    return response.body.results;
  }

  public static async getProduct(key: string): Promise<Product> {
    const response = await anonymApiRoot.products().withKey({ key }).get().execute();
    console.log('responseProduct', response);
    return response.body;
  }
}

export default ProductService;
