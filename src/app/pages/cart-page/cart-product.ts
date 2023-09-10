import BaseComponent from '../../shared/view/base-component';
import ProductCard from '../../shared/types/product-card-type';

class CartProductComponent extends BaseComponent {
  public productCartWrapper!: HTMLElement;
  public removeFromCart!: HTMLButtonElement;
  public priceProduct!: HTMLElement;

  public render(parent: HTMLElement, product: ProductCard) {
    this.productCartWrapper = BaseComponent.renderElem(parent, 'div', ['cart-product-wrapper']);
    const productImgWrapper = BaseComponent.renderElem(this.productCartWrapper, 'div', ['cart-product__img-wrapper']);
    const productContentWrapper = BaseComponent.renderElem(this.productCartWrapper, 'div', [
      'cart-product__content-wrapper',
    ]);
    const productQtyWrapper = BaseComponent.renderElem(this.productCartWrapper, 'div', ['cart-product__qty-wrapper']);
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
    const fullPrice = BaseComponent.renderElem(
      pricesContainer,
      'h3',
      ['cart-product__price', 'text-regular'],
      `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format((product.price ?? 0) / 100)}`
    );
    if (product.discount) {
      fullPrice.classList.add('old-full-price');
      BaseComponent.renderElem(
        pricesContainer,
        'h3',
        ['cart-product__price', 'cart-discounted-price', 'text-regular'],
        `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
          (product.discount ?? 0) / 100
        )}`
      );
    }
    BaseComponent.renderElem(
      productQtyWrapper,
      'h3',
      ['cart-product__qty', 'text-head-s'],
      product.qtyInCart?.toString()
    );
    this.removeFromCart = BaseComponent.renderElem(
      productQtyWrapper,
      'button',
      ['remove-from-cart'],
      'remove'
    ) as HTMLButtonElement;
    this.removeFromCart.dataset.key = product.itemId;
    this.priceProduct = BaseComponent.renderElem(
      productPriceWrapper,
      'h3',
      ['cart-product__price', 'text-head-s'],
      `${(product.priceInCart ?? 0) / 100} €`
    );
  }
}

export default CartProductComponent;
