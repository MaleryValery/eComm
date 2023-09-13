import { Cart, MyCartUpdateAction } from '@commercetools/platform-sdk';
// eslint-disable-next-line import/no-cycle
import AuthService from './auth-service';
import ApiMessageHandler from '../shared/util/api-message-handler';
import CartController from '../pages/cart-page/cart-controller';

class CartService {
  public static _cart: Cart | null;

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
    if (!AuthService.apiRoot) AuthService.createApiRootAnonymous();
    AuthService.checkExistToken();
    const response = await AuthService.apiRoot
      .me()
      .carts()
      .withId({ ID: this.cart?.id as string })
      .get()
      .execute();
    this.cart = response.body;
    CartController.getCartFromResponse(response.body);
    return response;
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
    CartController.getCartFromResponse(response.body);
  }

  public static async addItemToCart(key: string): Promise<void> {
    try {
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
      CartController.getCartFromResponse(response.body);
      ApiMessageHandler.showMessage('Item is added to cart', 'success');
    } catch (err) {
      ApiMessageHandler.showMessage('Cannot add item to cart', 'fail');
    }
  }

  public static async decreaseItemToCart(itemId: string) {
    try {
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
      CartController.getCartFromResponse(response.body);
      ApiMessageHandler.showMessage("Item's qty is decreased in cart", 'success');
    } catch (err) {
      ApiMessageHandler.showMessage("Cannot decrease item's qty in cart", 'fail');
    }
  }

  public static async removeItemFromCart(itemId: string) {
    try {
      AuthService.checkExistToken();
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
        CartController.getCartFromResponse(response.body);
        ApiMessageHandler.showMessage('Item is removed from cart', 'success');
      }
    } catch (err) {
      ApiMessageHandler.showMessage('Cannot remove item from cart', 'fail');
    }
  }

  public static async removeAllItemsFromCart() {
    try {
      AuthService.checkExistToken();
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
      CartController.getCartFromResponse(response.body);
      ApiMessageHandler.showMessage('All items are removed from cart', 'success');
    } catch (err) {
      ApiMessageHandler.showMessage('Cannot remove items from cart', 'fail');
    }
  }
}

export default CartService;
