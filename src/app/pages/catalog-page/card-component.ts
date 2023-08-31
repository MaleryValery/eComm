/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseComponent from '../../shared/view/base-component';
import ProductCard from '../../shared/types/product-card-type';

class CardComponent extends BaseComponent {
  render(parent: HTMLElement, cardDto: ProductCard): void {
    const cardWrapper = BaseComponent.renderElem(parent, 'div', ['card-wrapper']);
    const cardImgContainer = BaseComponent.renderElem(cardWrapper, 'div', ['card-img_wrapper']);
    const img = BaseComponent.renderElem(cardImgContainer, 'img', ['card-img']) as HTMLImageElement;
    img.src = cardDto.imageUrl;
    img.alt = 'img';
    const cardName = BaseComponent.renderElem(cardWrapper, 'span', ['card-name'], cardDto.itemName);
    const priceBlock = BaseComponent.renderElem(cardWrapper, 'div', ['card-price_block']);

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

    const moreBtn = BaseComponent.renderElem(cardWrapper, 'button', ['details-btn'], 'View Details');
    moreBtn.dataset.key = cardDto.itemKey;
  }
}

export default CardComponent;
