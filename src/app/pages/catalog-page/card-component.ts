/* eslint-disable @typescript-eslint/no-unused-vars */
import { Cart, LineItem } from '@commercetools/platform-sdk';
import BaseComponent from '../../shared/view/base-component';
import ProductCard from '../../shared/types/product-card-type';
import Router from '../../shared/util/router';
import CartService from '../../services/cart-service';
import CartController from '../cart-page/cart-controller';

class CardComponent extends BaseComponent {
  private cardWrapper!: HTMLElement;
  private cardKey!: string;

  render(parent: HTMLElement, cardDto: ProductCard): void {
    const cartLineItemsData = CartController.checkItemInCart();

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
    this.onClickCard();
  }

  private renderBtns(parent: HTMLElement, lineItemsData: [number, LineItem[]] | null) {
    const btnContainer = BaseComponent.renderElem(parent, 'div', ['card-btn__wrapper']);
    const moreBtn = BaseComponent.renderElem(btnContainer, 'button', ['details-btn'], 'Details');
    const cartBtn = BaseComponent.renderElem(btnContainer, 'button', ['basket-btn'], 'To cart') as HTMLButtonElement;
    moreBtn.dataset.key = this.cardKey;
    cartBtn.dataset.key = this.cardKey.slice(3);

    if (lineItemsData) {
      const [totalQty, lineItems] = lineItemsData;
      this.emitter.emit('changeCartQty', totalQty);
      if (lineItems && lineItems.find((item) => item.productKey === this.cardKey)) {
        cartBtn.disabled = true;
      } else {
        cartBtn.disabled = false;
      }
    }
  }

  private onClickCard() {
    this.cardWrapper.addEventListener('click', async (e) => {
      const target = e.target as HTMLButtonElement;
      const itemSKU = target.dataset.key;
      if (target.classList.contains('basket-btn')) {
        if (itemSKU) {
          await CartService.addItemToCart(itemSKU);
          target.disabled = true;
        }
      } else {
        Router.navigate(`/catalog/${this.cardKey}`);
      }
    });
  }
}

export default CardComponent;
