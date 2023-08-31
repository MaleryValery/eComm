import { Product, Image } from '@commercetools/platform-sdk';
import 'swiper/css/bundle';
import ProductService from '../../services/products-service';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import './product-component.scss';
import './product-swiper-zoom.scss';
import './product-swiper.scss';
import loadSwiper from '../../shared/util/swiper';

class ProductComponent extends RouteComponent {
  private cardWrapper!: HTMLElement;
  private productImgs!: Image[];
  private productsWrapper!: HTMLElement;
  private productName!: HTMLElement;
  private swiperWrapper!: HTMLElement;
  private modalContainer!: HTMLElement;
  private fullPrice!: HTMLElement;
  private discountedPrice!: HTMLElement;

  public async render(parent: HTMLElement): Promise<void> {
    super.render(parent);
    this.container.classList.add('product-route');
    this.productsWrapper = BaseComponent.renderElem(parent, 'div', ['product-wrapper']);
    this.renderProductCard(await ProductService.getProduct('KEYAH0003'));
    this.container.append(this.productsWrapper);
  }

  public renderProductCard(card: Product): void {
    this.productName = BaseComponent.renderElem(
      this.productsWrapper,
      'p',
      ['product-name'],
      card.masterData.current.name.en
    );
    this.cardWrapper = BaseComponent.renderElem(this.productsWrapper, 'div', ['product-card']);

    if (card.key) this.renderTextContentProductCard(card);
    this.renderImages(this.cardWrapper, 'regular');
    this.renderImagesPopup(document.body);
  }

  public async renderTextContentProductCard(card: Product): Promise<void> {
    this.productImgs = card.masterData.current.masterVariant.images as Image[];
    if (this.productImgs.length > 1) await loadSwiper();
    const textContentWrapper = BaseComponent.renderElem(this.cardWrapper, 'div', ['text-content-wrapper']);
    BaseComponent.renderElem(textContentWrapper, 'p', ['product-description'], card.masterData.current.description?.en);
    const productSpecWrapper = BaseComponent.renderElem(textContentWrapper, 'ul', ['text-spec_list']);
    if (card.masterData.current.masterVariant.attributes && card.masterData.current.masterVariant.attributes.length) {
      card.masterData.current.masterVariant.attributes.forEach((attribute) => {
        productSpecWrapper.insertAdjacentHTML(
          'beforeend',
          `<li class = 'text-spec_element'><strong>${attribute.name}: </strong> <span>${attribute.value}</span></li>`
        );
      });
    }
    this.renderPrices(card, textContentWrapper);
  }

  public async renderPrices(card: Product, parent: HTMLElement): Promise<void> {
    const pricesContainer = BaseComponent.renderElem(parent, 'div', ['prices-content-wrapper']);
    if (card.masterData.current.masterVariant.prices && card.masterData.current.masterVariant.prices.length) {
      this.fullPrice = BaseComponent.renderElem(
        pricesContainer,
        'div',
        ['full-price'],
        `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
          card.masterData.current.masterVariant.prices[0].value.centAmount / 100
        )} `
      );
    }
    if (
      card.masterData.current.masterVariant.prices?.length &&
      card.masterData.current.masterVariant.prices[0].discounted
    ) {
      this.fullPrice.classList.add('old-full-price');
      BaseComponent.renderElem(
        pricesContainer,
        'div',
        ['discounted-price'],
        `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
          card.masterData.current.masterVariant.prices[0].discounted.value.centAmount / 100
        )}`
      );
    }
  }

  public renderImages(parent: HTMLElement, type = 'regular'): void {
    this.swiperWrapper = BaseComponent.renderElem(parent, 'div', ['swiper-container', `${type}`]);

    this.swiperWrapper.addEventListener('click', (e) => {
      this.openImagesPopup(e, this.modalContainer);
    });
    let imgDataHTML = '';

    this.productImgs.forEach((img) => {
      if (type === 'regular') {
        imgDataHTML += `<div class="swiper-slide ${type}"><img class = 'product-card_img ${type}' src='${img.url}' alt ='${img.label}'></div>`;
      } else {
        imgDataHTML += `<div class="swiper-slide ${type}"><div class="swiper-zoom-container ${type}"><img class = 'product-zoom-card_img' src='${img.url}' alt ='${img.label}'></div></div>`;
      }
    });

    const controllersSwiper =
      this.productImgs.length > 1
        ? `<div class = 'swiper-button-next ${type}'></div>
           <div class = 'swiper-button-prev ${type}'></div>
           <div class="swiper-pagination ${type}"></div>`
        : '';
    this.swiperWrapper.insertAdjacentHTML(
      'beforeend',
      `
    <div class="swiper mySwiper ${type}">
      <div class="swiper-wrapper">
        ${imgDataHTML}
      </div>
      ${type !== 'zoom' ? controllersSwiper : ''}
      </div>
      ${type === 'zoom' ? controllersSwiper : ''}
    `
    );
  }

  public renderImagesPopup(parent: HTMLElement): void {
    this.modalContainer = BaseComponent.renderElem(parent, 'div', ['popup-wrapper', 'hide']);
    const closeBtn = BaseComponent.renderElem(this.modalContainer, 'div', ['close-btn']);

    closeBtn.addEventListener('click', (e) => {
      this.closeImagesPopup(e, this.modalContainer);
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

  public closeImagesPopup(event: Event, popup: HTMLElement) {
    const targetEvent = event.target as HTMLElement;
    console.log(targetEvent);
    if (!popup.classList.contains('hide')) {
      popup.classList.add('hide');
      document.body.classList.remove('no-scroll');
    }
  }
}
export default ProductComponent;
