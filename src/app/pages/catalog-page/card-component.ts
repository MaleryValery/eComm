/* eslint-disable @typescript-eslint/no-unused-vars */
import { Cart, LineItem } from '@commercetools/platform-sdk';
import BaseComponent from '../../shared/view/base-component';
import ProductCard from '../../shared/types/product-card-type';
import Router from '../../shared/util/router';
import CartService from '../../services/cart-service';
import Loader from '../../shared/view/loader/loader';

class CardComponent extends BaseComponent {
  private cardWrapper!: HTMLElement;
  private cardKey!: string;
  private cartBtn!: HTMLButtonElement;
  private loader = new Loader();

  render(parent: HTMLElement, cardDto: ProductCard): void {
    const cartLineItemsData = CartService.checkItemInCart();

    this.cardWrapper = BaseComponent.renderElem(parent, 'div', ['card-wrapper']);
    const cardImgContainer = BaseComponent.renderElem(this.cardWrapper, 'div', ['card-img_wrapper']);
    const img = BaseComponent.renderElem(cardImgContainer, 'img', ['card-img']) as HTMLImageElement;
    img.src = cardDto.imageUrl;
    img.alt = 'img';

    const cardTextContainer = BaseComponent.renderElem(this.cardWrapper, 'div', ['card-wrapper__text']);
    const cardName = BaseComponent.renderElem(cardTextContainer, 'span', ['card-name', 'tooltip'], cardDto.itemName);
    cardName.setAttribute('data-title', cardDto.itemName);
    const priceBlock = BaseComponent.renderElem(cardTextContainer, 'div', ['card-price_block']);

    if (cardDto.discount) {
      const curPrice = BaseComponent.renderElem(
        priceBlock,
        'span',
        ['card_cur-price'],
        `€ ${(cardDto.discount / 100).toString()}`
      );
      const oldPrice = BaseComponent.renderElem(
        priceBlock,
        'span',
        ['card_old-price'],
        `€ ${(cardDto.price / 100).toString()}`
      );
    } else {
      const curPrice = BaseComponent.renderElem(
        priceBlock,
        'span',
        ['card_cur-price'],
        `€ ${(cardDto.price / 100).toString()}`
      );
    }
    this.cardKey = cardDto.itemKey;

    this.renderBtns(cardTextContainer, cartLineItemsData);
    this.loader.init(this.cartBtn);
    this.onClickCard();
  }

  private renderBtns(parent: HTMLElement, lineItemsData: LineItem[] | null) {
    const btnContainer = BaseComponent.renderElem(parent, 'div', ['card-btn__wrapper']);
    const moreBtn = BaseComponent.renderElem(btnContainer, 'button', ['details-btn', 'btn_blue'], 'Details');
    this.cartBtn = BaseComponent.renderElem(btnContainer, 'button', ['basket-btn'], 'To cart') as HTMLButtonElement;
    moreBtn.dataset.key = this.cardKey;
    this.cartBtn.dataset.key = this.cardKey.slice(3);

    if (lineItemsData?.length) {
      if (lineItemsData.find((item) => item.productKey === this.cardKey)) {
        this.cartBtn.disabled = true;
      } else {
        this.cartBtn.disabled = false;
      }
    } else {
      this.cartBtn.disabled = false;
    }
  }

  private onClickCard() {
    this.cardWrapper.addEventListener('click', async (e) => {
      const target = e.target as HTMLButtonElement;
      const itemSKU = target.dataset.key;
      if (target.classList.contains('basket-btn') || target.closest('.loader')) {
        if (itemSKU) {
          this.loader.show();
          await CartService.addItemToCart(itemSKU);
          target.disabled = true;
          this.emitter.emit('updateQtyHeader', CartService.cart?.totalLineItemQuantity);
          this.loader.hide();
        }
      } else {
        Router.navigate(`/catalog/${this.cardKey}`);
      }
    });
  }
}

export default CardComponent;
