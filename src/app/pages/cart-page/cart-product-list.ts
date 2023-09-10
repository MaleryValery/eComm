import { Cart, LineItem } from '@commercetools/platform-sdk';
import BaseComponent from '../../shared/view/base-component';
import ProductCard from '../../shared/types/product-card-type';
import CartService from '../../services/cart-service';
import CartProductComponent from './cart-product';

class CartListProductsComponent extends BaseComponent {
  public productsListWrapper!: HTMLElement;
  public productsListBody!: HTMLElement;
  public productsListFooter!: HTMLElement;

  private subscriptions() {
    this.emitter.subscribe('renderCarts', () => this.renderCards());
  }

  private bindEvents() {
    this.productsListBody.addEventListener('click', (e) => {
      this.removeItem(e);
    });
  }

  private async removeItem(e: Event) {
    const eventTarget = e.target as HTMLElement;
    const keyItem = eventTarget.dataset.key;
    if (eventTarget.classList.contains('remove-from-cart') && keyItem) {
      await CartService.removeItemFromCart(keyItem);
      this.emitter.emit('renderCarts', undefined);
    }
  }

  public render(parent: HTMLElement) {
    this.productsListWrapper = BaseComponent.renderElem(parent, 'div', ['product-list__wrapper']);
    const productsListHeader = BaseComponent.renderElem(this.productsListWrapper, 'div', [
      'product-list__header',
      'text-regular',
    ]);
    BaseComponent.renderElem(productsListHeader, 'div', ['header-element'], 'Image');
    BaseComponent.renderElem(productsListHeader, 'div', ['header-element'], 'Product details');
    BaseComponent.renderElem(productsListHeader, 'div', ['header-element'], 'Qty');
    BaseComponent.renderElem(productsListHeader, 'div', ['header-element'], 'Total price');

    this.productsListBody = BaseComponent.renderElem(this.productsListWrapper, 'div', ['product-list__body']);
    this.productsListFooter = BaseComponent.renderElem(this.productsListWrapper, 'div', ['product-list__footer']);
    this.subscriptions();
    this.bindEvents();
  }

  private async renderCards() {
    this.productsListBody.innerHTML = '';

    const cart = await CartService.getUserCart();

    cart.body.lineItems.forEach((item: LineItem) => {
      const cardDto: ProductCard = {
        itemKey: item.productKey || '',
        itemId: item.id,
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
    BaseComponent.renderElem(
      productsListItemFooter,
      'span',
      ['header-element', 'text-hint'],
      cart.totalLineItemQuantity?.toString()
    );
    BaseComponent.renderElem(
      productsListItemFooter,
      'span',
      ['header-element', 'text-hint'],

      `${(cart.totalPrice?.centAmount ?? 0) / 100} €`
    );
  }
}

export default CartListProductsComponent;
