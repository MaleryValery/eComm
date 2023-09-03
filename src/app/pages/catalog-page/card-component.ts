/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseComponent from '../../shared/view/base-component';
import ProductCard from '../../shared/types/product-card-type';
import Router from '../../shared/util/router';

class CardComponent extends BaseComponent {
  private cardWrapper!: HTMLElement;
  private cardKey!: string;

  render(parent: HTMLElement, cardDto: ProductCard): void {
    this.cardWrapper = BaseComponent.renderElem(parent, 'div', ['card-wrapper']);
    const cardImgContainer = BaseComponent.renderElem(this.cardWrapper, 'div', ['card-img_wrapper']);
    const img = BaseComponent.renderElem(cardImgContainer, 'img', ['card-img']) as HTMLImageElement;
    img.src = cardDto.imageUrl;
    img.alt = 'img';
    const cardName = BaseComponent.renderElem(this.cardWrapper, 'span', ['card-name'], cardDto.itemName);
    const priceBlock = BaseComponent.renderElem(this.cardWrapper, 'div', ['card-price_block']);

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

    const moreBtn = BaseComponent.renderElem(this.cardWrapper, 'button', ['details-btn'], 'View Details');
    moreBtn.dataset.key = this.cardKey;

    this.onClickCard();
  }

  private onClickCard() {
    this.cardWrapper.addEventListener('click', () => {
      Router.navigate(`/catalog/${this.cardKey}`);
    });
  }
}

export default CardComponent;
