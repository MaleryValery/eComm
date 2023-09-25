import { Product, Image, LineItem } from '@commercetools/platform-sdk';
import 'swiper/css/bundle';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import './product-component.scss';
import './product-swiper-zoom.scss';
import './product-swiper.scss';
import loadSwiper from '../../shared/util/swiper';
import ProductService from '../../services/products-service';
import renderIcon from '../../shared/util/render-icon';
import loadZoomSwiper from '../../shared/util/swiper-zoom';
import Loader from '../../shared/view/loader/loader';
import CartService from '../../services/cart-service';

class ProductComponent extends RouteComponent {
  private cardWrapper!: HTMLElement;
  private productImgs!: Image[];
  private productsWrapper!: HTMLElement;
  private productPopup!: HTMLElement;
  private productName!: HTMLElement;
  private swiperWrapper!: HTMLElement;
  private modalContainer!: HTMLElement;
  private fullPrice!: HTMLElement;

  private loader = new Loader();

  private productKey = '';
  private productId = '';
  private addBtn!: HTMLButtonElement;
  private removeBtn!: HTMLButtonElement;

  public async render(parent: HTMLElement): Promise<void> {
    super.render(parent);
    this.container.classList.add('product-route');

    this.productsWrapper = BaseComponent.renderElem(parent, 'div', ['product-wrapper']);
    this.productPopup = BaseComponent.renderElem(parent, 'div', ['product-popup-container']);
    this.container.append(this.productsWrapper);

    this.loader.init(this.parent, ['loader_sticky']);
    this.emitter.subscribe('hashchange', () => this.closeImagesPopup(this.modalContainer));
    this.bindEvents();
  }

  private bindEvents(): void {
    this.container.addEventListener('click', (e) => {
      this.onCartBtnClick(e);
    });
  }

  public renderProductCard(product: Product): void {
    this.productName = BaseComponent.renderElem(
      this.productsWrapper,
      'p',
      ['product-name', 'text-head-m'],
      product.masterData.current.name.en
    );
    this.cardWrapper = BaseComponent.renderElem(this.productsWrapper, 'div', ['product-card-container']);
    this.cardWrapper.innerHTML = '';
    if (product.key) this.renderTextContentProductCard(product);
    this.renderImages(this.cardWrapper, 'regular');
    this.renderImagesPopup();
  }

  public async renderTextContentProductCard(product: Product): Promise<void> {
    const cartLineItemsData = CartService.checkItemInCart();
    this.productKey = (product.key as string).slice(3);
    this.productId = product.id;

    this.productImgs = product.masterData.current.masterVariant.images as Image[];
    await loadSwiper();
    const textContentWrapper = BaseComponent.renderElem(this.cardWrapper, 'div', ['text-content-wrapper']);
    BaseComponent.renderElem(
      textContentWrapper,
      'p',
      ['product-description'],
      product.masterData.current.description?.en
    );
    const productSpecWrapper = BaseComponent.renderElem(textContentWrapper, 'ul', ['text-spec_list']);
    if (
      product.masterData.current.masterVariant.attributes &&
      product.masterData.current.masterVariant.attributes.length
    ) {
      product.masterData.current.masterVariant.attributes.forEach((attribute) => {
        productSpecWrapper.insertAdjacentHTML(
          'beforeend',
          `<li class = 'text-spec_element'><strong>${attribute.name}: </strong> <span>${attribute.value}</span></li>`
        );
      });
    }
    this.renderPrices(product, textContentWrapper);
    this.renderButtons(textContentWrapper, cartLineItemsData);
  }

  private renderButtons(parent: HTMLElement, lineItemsData: LineItem[] | null): void {
    const btnContainer = BaseComponent.renderElem(parent, 'div', ['product__btn-wrapper']);
    this.addBtn = BaseComponent.renderElem(
      btnContainer,
      'button',
      ['product__btn_add'],
      'Add to cart'
    ) as HTMLButtonElement;
    this.addBtn.setAttribute('data-btn-medium', '');
    this.removeBtn = BaseComponent.renderElem(
      btnContainer,
      'button',
      ['product__btn_remove', 'btn_red'],
      'Remove from cart'
    ) as HTMLButtonElement;
    this.removeBtn.setAttribute('data-btn-small', '');

    if (lineItemsData?.length && lineItemsData.find((item) => item.productId === this.productId)) {
      this.addBtn.disabled = true;
      this.removeBtn.disabled = false;
    } else {
      this.addBtn.disabled = false;
      this.removeBtn.disabled = true;
    }
  }

  public renderPrices(product: Product, parent: HTMLElement): void {
    const pricesContainer = BaseComponent.renderElem(parent, 'div', ['prices-content-wrapper']);
    if (product.masterData.current.masterVariant.prices && product.masterData.current.masterVariant.prices.length) {
      this.fullPrice = BaseComponent.renderElem(
        pricesContainer,
        'div',
        ['full-price'],
        `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
          product.masterData.current.masterVariant.prices[0].value.centAmount / 100
        )} `
      );
    }
    if (
      product.masterData.current.masterVariant.prices?.length &&
      product.masterData.current.masterVariant.prices[0].discounted
    ) {
      this.fullPrice.classList.add('old-full-price');
      BaseComponent.renderElem(
        pricesContainer,
        'div',
        ['discounted-price'],
        `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
          product.masterData.current.masterVariant.prices[0].discounted.value.centAmount / 100
        )}`
      );
    }
  }

  public renderImages(parent: HTMLElement, type = 'regular'): void {
    this.swiperWrapper = BaseComponent.renderElem(parent, 'div', ['swiper-container', `swiper-container-${type}`]);
    this.swiperWrapper.innerHTML = '';

    this.swiperWrapper.addEventListener('click', (e) => {
      this.openImagesPopup(e, this.modalContainer);
    });
    let imgDataHTML = '';

    this.productImgs.forEach((img) => {
      if (type === 'regular') {
        imgDataHTML += `<div class="swiper-slide swiper-slide-${type}"><img class = 'product-card_img ${type}' src='${img.url}' alt ='${img.label}'></div>`;
      } else {
        imgDataHTML += `<div class="swiper-slide swiper-slide-${type}"><div class="swiper-zoom-container ${type}"><img class = 'product-zoom-card_img' src='${img.url}' alt ='${img.label}'></div></div>`;
      }
    });

    const controllersSwiper =
      this.productImgs.length > 1
        ? `<div class = 'swiper-button-next swiper-button-next-${type}'></div>
           <div class = 'swiper-button-prev swiper-button-prev-${type}'></div>`
        : '';
    this.swiperWrapper.insertAdjacentHTML(
      'beforeend',
      `
    <div class="swiper my-swiper-${type}">
      <div class="swiper-wrapper">
        ${imgDataHTML}
      </div>
      ${type !== 'zoom' ? controllersSwiper : ''}
      </div>
      ${type === 'zoom' ? controllersSwiper : ''}
    `
    );
  }

  public renderImagesPopup(): void {
    this.productPopup.innerHTML = '';
    loadZoomSwiper();
    this.modalContainer = BaseComponent.renderElem(this.productPopup, 'div', ['popup-wrapper', 'hide']);
    const closeBtn = renderIcon(this.modalContainer, ['close-btn'], 'close-btn');

    closeBtn.addEventListener('click', () => {
      this.closeImagesPopup(this.modalContainer);
    });
    this.renderImages(this.modalContainer, 'zoom');
  }

  public openImagesPopup(event: Event, popup: HTMLElement) {
    const targetEvent = event.target as HTMLElement;
    if (targetEvent?.classList.contains('product-card_img')) {
      popup.classList.remove('hide');
      document.body.classList.add('no-scroll');
    }
  }

  public closeImagesPopup(popup: HTMLElement) {
    if (popup && !popup.classList.contains('hide')) {
      popup.classList.add('hide');
      document.body.classList.remove('no-scroll');
    }
  }

  private async onCartBtnClick(e: Event): Promise<void> {
    const { target } = e;
    if (!(target instanceof HTMLElement) || target.hasAttribute('disabled') || !target.closest('.product__btn-wrapper'))
      return;

    const loader = new Loader();
    loader.init(target);

    if (target.classList.contains('product__btn_add')) {
      await this.addToCart(loader);
    } else if (target.classList.contains('product__btn_remove')) {
      await this.removeFromCart(loader);
    }

    this.emitter.emit('setFilteredItems', null);
  }

  private async addToCart(loader: Loader): Promise<void> {
    loader.show();
    await CartService.addItemToCart(this.productKey);
    this.addBtn.disabled = true;
    this.removeBtn.disabled = false;
    this.emitter.emit('updateQtyHeader', CartService.cart?.totalLineItemQuantity);
    loader.hide();
  }

  private async removeFromCart(loader: Loader): Promise<void> {
    loader.show();
    const curCartItem = (CartService.cart?.lineItems as LineItem[]).find(
      (item) => item.productId === this.productId
    ) as LineItem;
    const { id } = curCartItem;
    await CartService.removeItemFromCart(id);
    this.addBtn.disabled = false;
    this.removeBtn.disabled = true;
    this.emitter.emit('renderItemsInCart', null);
    this.emitter.emit('updateQtyHeader', CartService.cart?.totalLineItemQuantity);
    this.emitter.emit('showRemoveAllBtn', CartService.cart?.totalLineItemQuantity);
    loader.hide();
  }

  public async show(path: string): Promise<void> {
    this.productsWrapper.innerHTML = '';
    super.show();
    this.loader.show();
    try {
      const pathWay = path.split('/');
      const productKey = pathWay[pathWay.length - 1].toUpperCase();
      const currentProductData = await ProductService.getProduct(productKey);
      if (currentProductData) {
        this.renderProductCard(currentProductData);
      }
      this.loader.hide();
    } catch {
      this.emitter.emit('showErrorPage', null);
      this.loader.hide();
    }
  }
}
export default ProductComponent;
