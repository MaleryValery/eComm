import BaseComponent from '../../shared/view/base-component';
import ProductCard from '../../shared/types/product-card-type';
import CartService from '../../services/cart-service';

class CartProductComponent extends BaseComponent {
  public productCartWrapper!: HTMLElement;
  public removeFromCart!: HTMLButtonElement;
  public increaseQty!: HTMLButtonElement;
  public decreaseQty!: HTMLButtonElement;
  public priceProduct!: HTMLElement;
  public priceProductTotal!: HTMLElement;
  public priceProductPromo!: HTMLElement;
  public currentItemQty!: HTMLElement;

  private subscriptions() {
    this.emitter.subscribe('updateCartQty', (itemId: string) => this.updateCart(itemId));
  }

  public render(parent: HTMLElement, product: ProductCard) {
    this.subscriptions();
    this.productCartWrapper = BaseComponent.renderElem(parent, 'div', ['cart-product-wrapper']);
    const productImgWrapper = BaseComponent.renderElem(this.productCartWrapper, 'div', ['cart-product__img-wrapper']);
    const productContentWrapper = BaseComponent.renderElem(this.productCartWrapper, 'div', [
      'cart-product__content-wrapper',
    ]);
    this.renderCartQty(product);
    const productPriceWrapper = BaseComponent.renderElem(this.productCartWrapper, 'div', [
      'cart-product__price-wrapper',
    ]);
    const productImg = BaseComponent.renderElem(productImgWrapper, 'img', ['product-img']) as HTMLImageElement;
    productImg.src = product.imageUrl;
    BaseComponent.renderElem(productContentWrapper, 'h3', ['cart-product__name', 'text-head-s'], product.itemName);
    BaseComponent.renderElem(
      productContentWrapper,
      'p',
      ['cart-product__dist', 'text-hint'],
      product.description ?? ''
    );
    const pricesContainer = BaseComponent.renderElem(productContentWrapper, 'div', ['product-content__price-wrapper']);
    if (product.discount) {
      this.priceProduct = BaseComponent.renderElem(
        pricesContainer,
        'h3',
        ['cart-product__price', 'text-regular'],
        `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
          (product.discount ?? 0) / 100
        )}`
      );
    } else {
      this.priceProduct = BaseComponent.renderElem(
        pricesContainer,
        'h3',
        ['cart-product__price', 'text-regular'],
        `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format((product.price ?? 0) / 100)}`
      );
    }
    if (product.pricePromo) {
      this.priceProduct.classList.add('old-full-price');
      this.priceProductPromo = BaseComponent.renderElem(
        pricesContainer,
        'h3',
        ['cart-product__price', 'cart-discounted-price', 'text-regular'],
        `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
          (product.pricePromo ?? 0) / 100
        )}`
      );
    }

    this.priceProductTotal = BaseComponent.renderElem(
      productPriceWrapper,
      'h3',
      ['cart-product__price', 'text-head-s'],
      `${(product.priceInCart ?? 0) / 100} €`
    );
  }

  private renderCartQty(product: ProductCard) {
    const productQtyWrapper = BaseComponent.renderElem(this.productCartWrapper, 'div', ['cart-product__qty-wrapper']);
    const manageQtyWrapper = BaseComponent.renderElem(productQtyWrapper, 'div', ['cart-product__manage-qty']);
    this.decreaseQty = BaseComponent.renderElem(
      manageQtyWrapper,
      'button',
      ['decr-from-cart'],
      '−'
    ) as HTMLButtonElement;
    this.decreaseQty.disabled = product.qtyInCart === 1;
    this.currentItemQty = BaseComponent.renderElem(
      manageQtyWrapper,
      'h3',
      ['cart-product__qty', 'text-head-s'],
      product.qtyInCart?.toString()
    );
    this.increaseQty = BaseComponent.renderElem(manageQtyWrapper, 'button', ['incr-to-cart'], '+') as HTMLButtonElement;

    this.removeFromCart = BaseComponent.renderElem(
      productQtyWrapper,
      'button',
      ['remove-from-cart'],
      'remove'
    ) as HTMLButtonElement;
    this.removeFromCart.dataset.id = product.itemId;
    this.removeFromCart.dataset.key = product.itemKey;
    this.removeFromCart.dataset.lineItem = product.itemIdInCart;
    this.decreaseQty.dataset.id = product.itemId;
    this.decreaseQty.dataset.key = product.itemKey;
    this.decreaseQty.dataset.lineItem = product.itemIdInCart;
    this.increaseQty.dataset.id = product.itemId;
    this.increaseQty.dataset.key = product.itemKey;
    this.increaseQty.dataset.lineItem = product.itemIdInCart;
    this.currentItemQty.dataset.id = product.itemId;
    this.currentItemQty.dataset.key = product.itemKey;
    this.currentItemQty.dataset.lineItem = product.itemIdInCart;
  }

  private updateCart(itemId: string) {
    const { cart } = CartService;
    const itemInCart = cart?.lineItems.find((item) => item.id === itemId);
    if (itemInCart && this.currentItemQty.dataset.lineItem === itemId) {
      this.currentItemQty.textContent = itemInCart.quantity.toString();
      this.priceProductTotal.textContent = `${itemInCart.totalPrice.centAmount / 100} €`;
      if (this.currentItemQty.textContent === '1') {
        this.decreaseQty.disabled = true;
      } else {
        this.decreaseQty.disabled = false;
      }
    }
  }
}

export default CartProductComponent;
