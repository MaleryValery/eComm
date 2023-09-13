/* eslint-disable no-param-reassign */
import { Cart, LineItem } from '@commercetools/platform-sdk';
import CartItem from '../../shared/types/cart-item';
import EventEmitter from '../../shared/util/emitter';

class CartController {
  private static cartState: Map<string, CartItem> = new Map();
  private static lineItems: LineItem[];
  private static totalQty: number;

  constructor(private emitter: EventEmitter) {
    CartController.getLocalStorage();
  }

  // public static setCartItem(item: CartItem) {
  //   const existItem = this.cartState.has(item.itemKey as string);
  //   if (existItem) {
  //     const qty = this.cartState.get(item.itemKey as string)?.itemQty as number;
  //     this.cartState.set(item.itemKey as string, { itemId: item.itemId, itemQty: qty + 1 });
  //   } else {
  //     this.cartState.set(item.itemId as string, { itemKey: item.itemKey, itemQty: item.itemQty });
  //   }
  //   console.log(this.cartState, 'set cartState');
  //   this.setLocalStorage(this.cartState);
  // }

  // public static decreaseCartItemQty(item: CartItem) {
  //   const existItem = this.cartState.has(item.itemId as string);
  //   if (!existItem) return;

  //   const qty = this.cartState.get(item.itemId as string)?.itemQty as number;
  //   this.cartState.set(item.itemId as string, { itemKey: item.itemKey, itemQty: qty - 1 });
  //   console.log(this.cartState, 'decrease cartState');
  //   this.setLocalStorage(this.cartState);
  // }

  // public static removeCartItem(itemId: string) {
  //   const existItem = this.cartState.has(itemId as string);
  //   console.log(this.cartState.get(itemId as string), itemId);
  //   if (!existItem) return;
  //   this.getCartQty();
  //   this.cartState.delete(itemId as string);
  //   this.setLocalStorage(this.cartState);
  // }

  // public static getCartQty() {
  //   let sumItems = 0;
  //   this.cartState.forEach((item) => {
  //     sumItems += item.itemQty;
  //   });
  //   console.log(this.cartState, 'sumItems cartState');
  //   return sumItems;
  // }

  public static setLocalStorage(cart: Map<string, CartItem>) {
    const cartObj = Object.fromEntries(cart.entries());
    localStorage.setItem('cartStateSnt', JSON.stringify(cartObj));
  }

  public static getLocalStorage() {
    const getCartState = JSON.parse(localStorage.getItem('cartStateSnt') as string);
    if (!getCartState) return;

    this.cartState = new Map(Object.entries(getCartState));
  }

  public static getCartFromResponse(cart: Cart) {
    const newCart = new Map();
    cart.lineItems.forEach((item) => {
      newCart.set(item.productKey, { itemId: item.productId, itemQty: item.quantity, itemIdInCart: item.id });
    });
    if (!newCart) return;
    this.setLocalStorage(newCart);
    this.cartState = new Map(Object.entries(newCart));
  }

  public static checkItemInCart(): [number, LineItem[]] | null {
    const cart = JSON.parse(localStorage.getItem('sntCart') as string) as Cart;
    if (cart) {
      this.lineItems = cart.lineItems;
      this.totalQty = cart.totalLineItemQuantity || 0;
    }

    return this.totalQty && this.lineItems ? [this.totalQty, this.lineItems] : null;
  }
}

export default CartController;
