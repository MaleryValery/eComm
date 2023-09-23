import { Product } from '@commercetools/platform-sdk';
import AuthService from './auth-service';

class ProductService {
  public static productsList: Product[];
  public static currentProduct: Product;

  public static async getProduct(key: string): Promise<Product> {
    AuthService.checkRefreshtToken();
    const response = await AuthService.apiRoot.products().withKey({ key }).get().execute();
    this.currentProduct = response.body;
    return this.currentProduct;
  }
}

export default ProductService;
