import { Cart, LineItem } from '@commercetools/platform-sdk';
import BaseComponent from '../../shared/view/base-component';
import ProductCard from '../../shared/types/product-card-type';
import CartService from '../../services/cart-service';
import CartProductComponent from './cart-product';
import CustomInput from '../../shared/view/custom-input';

class CartListProductsComponent extends BaseComponent {
  public productsListWrapper!: HTMLElement;
  public productsListBody!: HTMLElement;
  public productsListFooter!: HTMLElement;
  public totalQty!: HTMLElement;
  public totalPrice!: HTMLElement;

  private subscriptions() {
    this.emitter.subscribe('renderItemsInCart', () => this.renderCards());
    this.emitter.subscribe('updateCartQty', () => this.updateTotalCart());
    this.emitter.subscribe('renderEmptyCart', () => this.renderEmptyCart());
  }

  private bindEvents() {
    this.productsListBody.addEventListener('click', (e) => {
      this.changeCartQty(e);
    });
  }

  private async changeCartQty(e: Event) {
    const eventTarget = e.target as HTMLElement;
    const lineItemId = eventTarget.dataset.lineItem as string;
    const itemSku = eventTarget.dataset.key?.slice(3) as string;
    if (eventTarget.classList.contains('remove-from-cart') && lineItemId) {
      await CartService.removeItemFromCart(lineItemId);
      this.emitter.emit('renderItemsInCart', null);
      this.emitter.emit('updateQtyHeader', CartService.cart?.totalLineItemQuantity);
      this.emitter.emit('showRemoveAllBtn', CartService.cart?.totalLineItemQuantity);
    }
    if (eventTarget.classList.contains('decr-from-cart') && lineItemId) {
      await CartService.decreaseItemToCart(lineItemId);
      this.emitter.emit('updateCartQty', lineItemId);
      this.emitter.emit('updateQtyHeader', CartService.cart?.totalLineItemQuantity);
    }
    if (eventTarget.classList.contains('incr-to-cart') && lineItemId) {
      await CartService.addItemToCart(itemSku);
      this.emitter.emit('updateCartQty', lineItemId);
      this.emitter.emit('updateQtyHeader', CartService.cart?.totalLineItemQuantity);
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
    const cart = await CartService.getUserCart().catch((err) => console.log(err));
    if (!cart?.body.lineItems.length) {
      this.renderEmptyCart();
      return;
    }

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
    this.renderPromocode(this.productsListBody);
  }

  private renderSummary(cart: Cart) {
    this.productsListFooter.innerHTML = '';
    const productsListFooterQty = BaseComponent.renderElem(this.productsListFooter, 'div', [
      'product-list__footer-item',
    ]);
    const productsListFooterAmount = BaseComponent.renderElem(this.productsListFooter, 'div', [
      'product-list__footer-item',
    ]);
    BaseComponent.renderElem(
      productsListFooterQty,
      'span',
      ['header-element', 'text-regular'],
      'Total quantity in cart:'
    );
    BaseComponent.renderElem(
      productsListFooterAmount,
      'span',
      ['header-element', 'text-regular'],
      'Total amount in cart:'
    );
    this.totalQty = BaseComponent.renderElem(
      productsListFooterQty,
      'span',
      ['header-element', 'text-regular'],
      cart.totalLineItemQuantity?.toString()
    );
    this.totalPrice = BaseComponent.renderElem(
      productsListFooterAmount,
      'span',
      ['header-element', 'text-regular'],

      `${(cart.totalPrice?.centAmount ?? 0) / 100} €`
    );
  }

  private renderEmptyCart() {
    this.productsListBody.innerHTML = '';
    this.productsListFooter.innerHTML = '';
    BaseComponent.renderElem(
      this.productsListBody,
      'div',
      ['empty-cart', 'text-head-s'],
      'Your cart is empty. Go to the catalog to find your best guitar.'
    );
  }

  private renderPromocode(parent: HTMLElement) {
    const promoWrapper = BaseComponent.renderElem(parent, 'div', ['promo-wrapper']);
    const promoInput = new CustomInput().render(promoWrapper, 'promocode', 'string', 'Do you have promocode?', false);
    const promoSubmitBtn = BaseComponent.renderElem(promoWrapper, 'button', ['promo-btn'], 'Apply code');
    console.log(promoInput, promoSubmitBtn);
  }

  private updateTotalCart() {
    const { cart } = CartService;
    this.totalQty.textContent = cart?.totalLineItemQuantity?.toString() || null;
    this.totalPrice.textContent = `${(cart?.totalPrice?.centAmount ?? 0) / 100} €`;
    this.emitter.emit('updateQtyHeader', cart?.totalLineItemQuantity);
  }
}

export default CartListProductsComponent;
