import { Cart, DiscountCode, LineItem, MyCartUpdateAction } from '@commercetools/platform-sdk';
// eslint-disable-next-line import/no-cycle
import AuthService from './auth-service';
import ApiMessageHandler from '../shared/util/api-message-handler';

class CartService {
  public static _cart: Cart | null;
  private static lineItems: LineItem[];
  public static promoCodes: DiscountCode[];

  public static set cart(cart: Cart | null) {
    this._cart = cart;
    localStorage.setItem('sntCart', JSON.stringify(cart));
  }

  public static get cart(): Cart | null {
    if (!this._cart) {
      this._cart = JSON.parse(localStorage.getItem('sntCart') as string);
    }
    return this._cart;
  }

  public static async getUserCart() {
    try {
      if (!AuthService.apiRoot) AuthService.createApiRootAnonymous();
      AuthService.checkRefreshtToken();
      const response = await AuthService.apiRoot
        .me()
        .carts()
        .withId({ ID: this.cart?.id as string })
        .get()
        .execute();
      this.cart = response.body;
      return response;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public static async createAnonCart(): Promise<void> {
    try {
      AuthService.checkRefreshtToken();
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
    } catch (error) {
      console.log('cannot create cart: ', (error as Error).message);
    }
  }

  public static async addItemToCart(key: string): Promise<void> {
    try {
      if (!this.cart) await this.createAnonCart();
      AuthService.checkRefreshtToken();
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
      ApiMessageHandler.showMessage('Item is added to cart', 'success');
    } catch (err) {
      ApiMessageHandler.showMessage('Cannot add item to cart', 'fail');
    }
  }

  public static async decreaseItemToCart(itemId: string): Promise<void> {
    try {
      AuthService.checkRefreshtToken();
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
      ApiMessageHandler.showMessage("Item's qty is decreased in cart", 'success');
    } catch (err) {
      ApiMessageHandler.showMessage("Cannot decrease item's qty in cart", 'fail');
    }
  }

  public static async removeItemFromCart(itemId: string): Promise<void> {
    try {
      AuthService.checkRefreshtToken();
      const itemInCart = this.cart?.lineItems.find((item) => item.id === itemId);
      if (itemInCart) {
        const qty = itemInCart.quantity;
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
                  quantity: qty,
                },
              ],
            },
          })
          .execute();
        this.cart = response.body;
        ApiMessageHandler.showMessage('Item is removed from cart', 'success');
      }
    } catch (err) {
      ApiMessageHandler.showMessage('Cannot remove item from cart', 'fail');
    }
  }

  public static async removeAllItemsFromCart(): Promise<void> {
    try {
      AuthService.checkRefreshtToken();
      if (!this.cart?.lineItems.length) {
        ApiMessageHandler.showMessage('Cart is empty', 'fail');
        return;
      }
      const itemsForRemove: MyCartUpdateAction[] = this.cart?.lineItems.map((item) => {
        return {
          action: 'removeLineItem',
          lineItemId: item.id,
          quantity: item.quantity,
        };
      });
      const response = await AuthService.apiRoot
        .me()
        .carts()
        .withId({ ID: this.cart?.id as string })
        .post({
          body: {
            version: this.cart?.version ?? 1,
            actions: [...itemsForRemove],
          },
        })
        .execute();
      this.cart = response.body;
      ApiMessageHandler.showMessage('All items are removed from cart', 'success');
    } catch (err) {
      ApiMessageHandler.showMessage('Cannot remove items from cart', 'fail');
    }
  }

  public static async setPromoToCart(promo: string) {
    try {
      if (!AuthService.apiRoot) AuthService.createApiRootAnonymous();
      AuthService.checkRefreshtToken();
      const response = await AuthService.apiRoot
        .me()
        .carts()
        .withId({ ID: this.cart?.id as string })
        .post({
          body: {
            version: this.cart?.version ?? 1,
            actions: [
              {
                action: 'addDiscountCode',
                code: promo.toUpperCase(),
              },
            ],
          },
        })
        .execute();
      this.cart = response.body;
    } catch (err) {
      ApiMessageHandler.showMessage(`Promo didn't found, ${(err as Error).message}`, 'fail');
    }
  }

  public static async removePromoFromCart(promo: string) {
    try {
      if (!AuthService.apiRoot) AuthService.createApiRootAnonymous();
      AuthService.checkRefreshtToken();
      const response = await AuthService.apiRoot
        .me()
        .carts()
        .withId({ ID: this.cart?.id as string })
        .post({
          body: {
            version: this.cart?.version ?? 1,
            actions: [
              {
                action: 'removeDiscountCode',
                discountCode: {
                  typeId: 'discount-code',
                  id: promo,
                },
              },
            ],
          },
        })
        .execute();
      this.cart = response.body;
    } catch (err) {
      console.log((err as Error).message);
    }
  }

  public static async getPromoCodes() {
    try {
      if (!AuthService.apiRoot) AuthService.createApiRootAnonymous();
      AuthService.checkRefreshtToken();
      const response = await AuthService.apiRoot.discountCodes().get().execute();
      this.promoCodes = response.body.results;
    } catch (err) {
      console.log((err as Error).message);
    }
  }

  public static checkItemInCart(): LineItem[] | null {
    const cart = JSON.parse(localStorage.getItem('sntCart') as string) as Cart;
    if (cart && cart.lineItems.length) {
      this.lineItems = cart.lineItems;
      return this.lineItems;
    }
    return null;
  }

  public static getDiscountCodeById(promoId: string): Promise<void | DiscountCode> {
    if (!AuthService.apiRoot) AuthService.createApiRootAnonymous();
    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
      .discountCodes()
      .withId({ ID: promoId })
      .get()
      .execute()
      .then((res) => res.body)
      .catch((err) => console.log((err as Error).message));
  }
}

export default CartService;
