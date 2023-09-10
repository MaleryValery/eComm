import { Cart } from '@commercetools/platform-sdk';
// eslint-disable-next-line import/no-cycle
import AuthService from './auth-service';

class CartService {
  public static _cart: Cart | null;

  public static set cart(cart: Cart | null) {
    this._cart = cart;
    localStorage.setItem('sntCart', JSON.stringify(cart));
  }

  public static get cart(): Cart | null {
    if (!this._cart) {
      this._cart = JSON.parse(localStorage.getItem('sntCart')!);
    }
    return this._cart;
  }

  public static isAuthorized(): boolean {
    return !!this.cart;
  }

  public static async getUserCart() {
    if (!AuthService.apiRoot) AuthService.createApiRootAnonymous();
    AuthService.checkExistToken();
    const response = await AuthService.apiRoot
      .me()
      .carts()
      // .activeCart()
      .withId({ ID: this.cart?.id as string })
      .get()
      .execute();
    this.cart = response.body;
    return response;
  }

  public static async getAnonCart() {
    const response = await AuthService.apiRoot.me().activeCart().get().execute();
    console.log('getAnonCart', response);
  }

  public static async createAnonCart() {
    AuthService.checkExistToken();
    const response = await AuthService.apiRoot
      .me()
      .carts()
      .post({
        body: {
          currency: 'EUR',
        },
      })
      .execute();

    this.cart = response.body;
    console.log('createAnonCart this.cart v', this.cart.version);
  }

  public static async createUserCart() {
    const response = await AuthService.apiRoot
      .me()
      .carts()
      .post({
        body: {
          currency: 'EUR',
        },
      })
      .execute();
    console.log('createUserCart', response);
  }

  public static async addItemToCart(key: string) {
    if (!this.cart) await this.createAnonCart();

    AuthService.checkExistToken();
    const response = await AuthService.apiRoot
      .me()
      .carts()
      .withId({ ID: this.cart?.id as string })
      .post({
        body: {
          version: this.cart?.version ?? 1,
          actions: [
            {
              action: 'addLineItem',
              sku: key,
              variantId: 1,
              quantity: 1,
            },
          ],
        },
      })
      .execute();
    this.cart = response.body;
    console.log('addItemToCart this.cart v', this.cart.version);
  }

  public static async removeItemFromCart(itemId: string) {
    AuthService.checkExistToken();
    const response = await AuthService.apiRoot
      .me()
      .carts()
      .withId({ ID: this.cart?.id as string })
      .post({
        body: {
          version: this.cart?.version ?? 1,
          actions: [
            {
              action: 'removeLineItem',
              lineItemId: itemId,
              quantity: 1,
            },
          ],
        },
      })
      .execute();
    this.cart = response.body;
    console.log('removeItemFromCart this.cart v', this.cart.version);
  }
}

export default CartService;
