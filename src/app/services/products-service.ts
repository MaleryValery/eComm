import { Product } from '@commercetools/platform-sdk';
import { anonymApiRoot } from '../shared/util/client-builder';

class ProductService {
  public static productsList: Product[];
  public static currentProduct: Product;

  public static async getAllProducts(): Promise<Product[]> {
    const response = await anonymApiRoot.products().get().execute();
    this.productsList = response.body.results;
    return response.body.results;
  }

  public static async getProduct(key: string): Promise<Product> {
    const response = await anonymApiRoot.products().withKey({ key }).get().execute();
    this.currentProduct = response.body;
    return this.currentProduct;
  }
}

export default ProductService;
