import { Cart, LineItem } from '@commercetools/platform-sdk';
import BaseComponent from '../../shared/view/base-component';
import ProductCard from '../../shared/types/product-card-type';
import CartService from '../../services/cart-service';
import CartProductComponent from './cart-product';

class CartListProductsComponent extends BaseComponent {
  public productsListWrapper!: HTMLElement;
  public productsListBody!: HTMLElement;
  public productsListFooter!: HTMLElement;
  public totalQty!: HTMLElement;
  public totalPrice!: HTMLElement;

  private subscriptions() {
    this.emitter.subscribe('renderCart', () => this.renderCards());
    this.emitter.subscribe('updateCartQty', () => this.updateTotalCart());
    this.emitter.subscribe('setEmptyCart', () => this.renderEmptyCart());
  }

  private bindEvents() {
    this.productsListBody.addEventListener('click', (e) => {
      this.removeItem(e);
    });
  }

  private async removeItem(e: Event) {
    const eventTarget = e.target as HTMLElement;
    const lineItemId = eventTarget.dataset.lineItem as string;
    const itemSku = eventTarget.dataset.key?.slice(3) as string;
    if (eventTarget.classList.contains('remove-from-cart') && lineItemId) {
      await CartService.removeItemFromCart(lineItemId);
      this.emitter.emit('setEmptyCart', null);
    }
    if (eventTarget.classList.contains('decr-from-cart') && lineItemId) {
      await CartService.decreaseItemToCart(lineItemId);
      this.emitter.emit('updateCartQty', lineItemId);
    }
    if (eventTarget.classList.contains('incr-to-cart') && lineItemId) {
      await CartService.addItemToCart(itemSku);
      this.emitter.emit('updateCartQty', lineItemId);
    }
    this.emitter.emit('setFilteredItems', null);
  }

  public render(parent: HTMLElement) {
    this.productsListWrapper = BaseComponent.renderElem(parent, 'div', ['product-list__wrapper']);

    this.productsListBody = BaseComponent.renderElem(this.productsListWrapper, 'div', ['product-list__body']);
    this.productsListFooter = BaseComponent.renderElem(this.productsListWrapper, 'div', ['product-list__footer']);
    this.subscriptions();
    this.bindEvents();
  }

  private async renderCards() {
    this.productsListBody.innerHTML = '';

    const cart = await CartService.getUserCart();

    if (!cart.body.lineItems.length) this.renderEmptyCart();
    cart.body.lineItems.forEach((item: LineItem) => {
      const cardDto: ProductCard = {
        itemKey: item.productKey || '',
        itemId: item.productId,
        itemIdInCart: item.id,
        imageUrl: item.variant.images?.length ? item.variant.images[0].url : '',
        itemName: item.name.en,
        price: item.variant.prices?.[0]?.value.centAmount || 0,
        discount: item.variant.prices?.[0]?.discounted?.value.centAmount,
        qtyInCart: item.quantity,
        priceInCart: item.totalPrice.centAmount,
      };
      new CartProductComponent(this.emitter).render(this.productsListBody, cardDto);
    });
    this.renderSummary(cart.body);
  }

  private renderSummary(cart: Cart) {
    this.productsListFooter.innerHTML = '';
    const productsListHeaderFooter = BaseComponent.renderElem(this.productsListFooter, 'div', [
      'product-list__footer-header',
    ]);
    const productsListItemFooter = BaseComponent.renderElem(this.productsListFooter, 'div', [
      'product-list__footer-items',
    ]);
    BaseComponent.renderElem(productsListHeaderFooter, 'span', ['header-element', 'text-hint'], 'Total Qty');
    BaseComponent.renderElem(productsListHeaderFooter, 'span', ['header-element', 'text-hint'], 'Total amount');
    this.totalQty = BaseComponent.renderElem(
      productsListItemFooter,
      'span',
      ['header-element', 'text-hint'],
      cart.totalLineItemQuantity?.toString()
    );
    this.totalPrice = BaseComponent.renderElem(
      productsListItemFooter,
      'span',
      ['header-element', 'text-hint'],

      `${(cart.totalPrice?.centAmount ?? 0) / 100} €`
    );
  }

  private renderEmptyCart() {
    this.productsListBody.innerHTML = '';
    BaseComponent.renderElem(
      this.productsListBody,
      'div',
      ['empty-cart', 'text-head-s'],
      'Your cart is empty 😱. Go to the catalog to find your best guitar'
    );
  }

  private updateTotalCart() {
    const cart = JSON.parse(localStorage.getItem('sntCart') as string) as Cart;
    this.totalQty.textContent = cart.totalLineItemQuantity?.toString() || null;
    this.totalPrice.textContent = `${(cart.totalPrice?.centAmount ?? 0) / 100} €`;
  }
}

export default CartListProductsComponent;
