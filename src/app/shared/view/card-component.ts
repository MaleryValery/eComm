/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseComponent from './base-component';

class CardComponent extends BaseComponent {
  render(parent: HTMLElement, key: string, avatar: string, itemName: string, price: number, discount?: number): void {
    const cardWrapper = BaseComponent.renderElem(parent, 'div', ['card-wrapper']);
    const img = BaseComponent.renderElem(cardWrapper, 'img', ['card-img']) as HTMLImageElement;
    img.src = avatar;
    img.alt = 'img';
    const cardName = BaseComponent.renderElem(cardWrapper, 'span', ['card-name'], itemName);
    const priceBlock = BaseComponent.renderElem(cardWrapper, 'div', ['card-price_block']);

    if (discount) {
      const curPrice = BaseComponent.renderElem(
        priceBlock,
        'span',
        ['card_cur-price'],
        `€ ${(discount / 100).toString()}`
      );
      const oldPrice = BaseComponent.renderElem(
        priceBlock,
        'span',
        ['card_old-price'],
        `€ ${(price / 100).toString()}`
      );
    } else {
      const curPrice = BaseComponent.renderElem(
        priceBlock,
        'span',
        ['card_cur-price'],
        `€ ${(price / 100).toString()}`
      );
    }

    const moreBtn = BaseComponent.renderElem(cardWrapper, 'button', ['details-btn'], 'View Details');
    moreBtn.dataset.key = key;
  }
}

export default CardComponent;
