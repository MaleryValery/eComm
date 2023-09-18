import { Cart, LineItem } from '@commercetools/platform-sdk';
import BaseComponent from '../../shared/view/base-component';
import ProductCard from '../../shared/types/product-card-type';
import CartService from '../../services/cart-service';
import CartProductComponent from './cart-product';
import CustomInput from '../../shared/view/custom-input';
import Router from '../../shared/util/router';
import ApiMessageHandler from '../../shared/util/api-message-handler';
import Loader from '../../shared/view/loader/loader';

class CartListProductsComponent extends BaseComponent {
  public productsListWrapper!: HTMLElement;
  public productsListBody!: HTMLElement;
  public productsListFooter!: HTMLElement;
  public totalQty!: HTMLElement;
  public totalPrice!: HTMLElement;
  public catalogBtn!: HTMLElement;

  private promoSubmitBtn!: HTMLButtonElement;
  private promoInput!: HTMLInputElement;
  private activePromo = '';

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

    const loader = new Loader();
    if (eventTarget.parentElement) loader.init(eventTarget.parentElement);

    if (eventTarget.classList.contains('remove-from-cart') && lineItemId) {
      await CartService.removeItemFromCart(lineItemId);
      await this.renderCards();
      this.emitter.emit('updateQtyHeader', CartService.cart?.totalLineItemQuantity);
      this.emitter.emit('showRemoveAllBtn', CartService.cart?.totalLineItemQuantity);
      this.checkMatchPromo();
    }
    if (eventTarget.classList.contains('decr-from-cart') && lineItemId) {
      loader.show();
      await CartService.decreaseItemToCart(lineItemId);
      this.emitter.emit('updateCartQty', lineItemId);
      this.emitter.emit('updateQtyHeader', CartService.cart?.totalLineItemQuantity);
      this.checkMatchPromo();
      loader.hide();
    }
    if (eventTarget.classList.contains('incr-to-cart') && lineItemId) {
      loader.show();
      await CartService.addItemToCart(itemSku);
      this.emitter.emit('updateCartQty', lineItemId);
      this.emitter.emit('updateQtyHeader', CartService.cart?.totalLineItemQuantity);
      this.checkMatchPromo();
      loader.hide();
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
    this.emitter.emit('showCartLoader', null);
    this.productsListBody.innerHTML = '';
    const cart = await CartService.getUserCart().catch((err) => console.log(err));
    this.emitter.emit('hideCartLoader', null);

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
        pricePromo: item.discountedPricePerQuantity[0]?.discountedPrice.value.centAmount || 0,
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
    if (cart.discountCodes.length && cart.discountCodes[0].state === 'MatchesCart') {
      let fullPrice = 0;
      cart.lineItems.forEach((item) => {
        fullPrice += item.price.value.centAmount * item.quantity;
      });
      BaseComponent.renderElem(
        productsListFooterAmount,
        'span',
        ['header-element', 'old-full-price', 'text-regular'],

        `${(fullPrice ?? 0) / 100} €`
      );
    }
    this.totalPrice = BaseComponent.renderElem(
      productsListFooterAmount,
      'span',
      ['header-element', 'text-regular'],

      `${(cart.totalPrice?.centAmount ?? 0) / 100} €`
    );
    this.emitter.emit('showRemoveAllBtn', CartService.cart?.totalLineItemQuantity);
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
    this.catalogBtn = BaseComponent.renderElem(
      this.productsListBody,
      'button',
      ['button-empty-cart'],
      "Let's go to the catalog"
    );
    this.catalogBtn.addEventListener('click', () => Router.navigate('/catalog'));
  }

  private checkActivePromo() {
    this.activePromo = CartService.cart ? CartService.cart.discountCodes[0]?.discountCode.id : '';
    if (this.activePromo && CartService.cart && CartService.cart.discountCodes[0]?.state === 'MatchesCart') {
      this.promoSubmitBtn.textContent = 'Remove code';
      this.promoSubmitBtn.classList.add('promo-btn_remove');
      CartService.getDiscountCodeById(this.activePromo).then((res) => {
        this.promoInput.value = res!.code;
        this.promoInput.disabled = true;
      });
    } else {
      this.promoSubmitBtn.classList.add('promo-btn_apply');
      this.promoSubmitBtn.textContent = 'Apply code';
    }
  }

  private renderPromocode(parent: HTMLElement) {
    const promoWrapper = BaseComponent.renderElem(parent, 'div', ['promo-wrapper']);
    this.promoInput = new CustomInput().render(promoWrapper, 'promocode', 'string', 'Do you have promocode?', false);
    this.promoSubmitBtn = BaseComponent.renderElem(
      promoWrapper,
      'button',
      ['promo-btn'],
      'Apply code'
    ) as HTMLButtonElement;
    this.checkActivePromo();
    this.promoSubmitBtn.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      e.preventDefault();
      this.applyPromo(target);
    });
  }

  private async applyPromo(target: HTMLElement) {
    if (!CartService.cart) return;
    await CartService.setPromoToCart(this.promoInput.value);

    if (
      CartService.cart.discountCodes[0]?.state === 'DoesNotMatchCart' ||
      target.classList.contains('promo-btn_remove')
    ) {
      await CartService.removePromoFromCart(CartService.cart.discountCodes[0]?.discountCode.id);
      if (target.classList.contains('promo-btn_remove')) {
        ApiMessageHandler.showMessage(`The promo code has been removed`, 'fail');
        await this.renderCards();
      } else {
        ApiMessageHandler.showMessage(`The conditions for applying the promo code are not met`, 'fail');
      }
      this.promoInput.disabled = false;
      this.promoInput.value = '';
    }
    if (CartService.cart.discountCodes[0]?.state === 'MatchesCart' && target.classList.contains('promo-btn_apply')) {
      ApiMessageHandler.showMessage(`The promo code has been applied`, 'success');
      await this.renderCards();
    }
  }

  private async checkMatchPromo() {
    if (CartService.cart?.discountCodes[0]?.state === 'DoesNotMatchCart') {
      ApiMessageHandler.showMessage(`Cart did't match promo, please find suitable promo`, 'fail');
      await CartService.removePromoFromCart(CartService.cart.discountCodes[0]?.discountCode.id);
      await this.renderCards();
    }
  }

  private updateTotalCart() {
    const { cart } = CartService;
    this.totalQty.textContent = cart?.totalLineItemQuantity?.toString() || null;
    this.totalPrice.textContent = `${(cart?.totalPrice?.centAmount ?? 0) / 100} €`;
    this.emitter.emit('updateQtyHeader', cart?.totalLineItemQuantity);
  }
}

export default CartListProductsComponent;
