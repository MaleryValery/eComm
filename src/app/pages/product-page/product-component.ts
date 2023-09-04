import { Product, Image } from '@commercetools/platform-sdk';
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

class ProductComponent extends RouteComponent {
  private cardWrapper!: HTMLElement;
  private productImgs!: Image[];
  private productsWrapper!: HTMLElement;
  private productPopup!: HTMLElement;
  private productName!: HTMLElement;
  private swiperWrapper!: HTMLElement;
  private modalContainer!: HTMLElement;
  private fullPrice!: HTMLElement;

  public async render(parent: HTMLElement): Promise<void> {
    super.render(parent);
    this.container.classList.add('product-route');

    this.productsWrapper = BaseComponent.renderElem(parent, 'div', ['product-wrapper']);
    this.productPopup = BaseComponent.renderElem(parent, 'div', ['product-popup-container']);
    this.container.append(this.productsWrapper);
  }

  public renderProductCard(product: Product): void {
    this.productsWrapper.innerHTML = '';
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
    this.productImgs = product.masterData.current.masterVariant.images as Image[];
    await loadSwiper();
    const textContentWrapper = BaseComponent.renderElem(this.cardWrapper, 'div', ['text-content-wrapper']);
    BaseComponent.renderElem(
      textContentWrapper,
      'p',
      ['product-description', 'text-hint'],
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
    if (!popup.classList.contains('hide')) {
      popup.classList.add('hide');
      document.body.classList.remove('no-scroll');
    }
  }

  public async show(path: string): Promise<void> {
    try {
      const pathWay = path.split('/');
      const productKey = pathWay[pathWay.length - 1].toUpperCase();
      const currentProductData = await ProductService.getProduct(productKey);
      if (currentProductData) {
        this.renderProductCard(currentProductData);
        super.show();
      }
    } catch {
      this.emitter.emit('showErrorPage', null);
    }
  }
}
export default ProductComponent;
