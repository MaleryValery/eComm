import { ProductProjection } from '@commercetools/platform-sdk';
import CatalogService from '../../services/catalog-service';
import ProductCard from '../../shared/types/product-card-type';
import CatalogController from '../../shared/util/catalog-controller';
import EventEmitter from '../../shared/util/emitter';
import BaseComponent from '../../shared/view/base-component';
import CardComponent from './card-component';

class CatalogCardsListComponent extends BaseComponent {
  private itemsMainWrapper!: HTMLElement;
  private searchEl!: HTMLInputElement;
  private categories!: HTMLElement;
  private price!: HTMLElement;
  private brands!: HTMLElement;
  private categoryName!: HTMLElement;
  private sortEl!: HTMLElement;

  constructor(private catalogController: CatalogController, private eventEmitter: EventEmitter) {
    super(eventEmitter);
  }

  render(parent: HTMLElement): void {
    const itemsWrapper = BaseComponent.renderElem(parent, 'div', ['catalog-list_wrapper']);

    const itemsHeader = BaseComponent.renderElem(itemsWrapper, 'div', ['catalog-header_wrapper']);
    this.categoryName = BaseComponent.renderElem(itemsHeader, 'span', ['catalog-header__name']);
    this.sortEl = BaseComponent.renderElem(itemsHeader, 'div', ['catalog-header__sort']);

    this.itemsMainWrapper = BaseComponent.renderElem(itemsWrapper, 'div', ['catalog-main_wrapper']);
    this.renderCards();

    this.emitter.subscribe('updateCards', (items: ProductProjection[]) => this.updateCards(items));
  }

  private renderCards() {
    this.itemsMainWrapper.innerHTML = '';

    CatalogService.getProducts().then((res) => {
      res.forEach((item) => {
        const cardDto: ProductCard = {
          itemKey: item.key || '',
          imageUrl: item.masterVariant.images?.[0]?.url || '',
          itemName: item.name.en,
          price: item.masterVariant.prices?.[0]?.value.centAmount || 0,
          discount: item.masterVariant.prices?.[0]?.discounted?.value.centAmount,
        };

        new CardComponent(this.emitter).render(this.itemsMainWrapper, cardDto);
      });
    });
  }

  private updateCards(items: ProductProjection[]) {
    this.itemsMainWrapper.innerHTML = '';
    items.forEach((item) => {
      const cardDto: ProductCard = {
        itemKey: item.key || '',
        imageUrl: item.masterVariant.images?.[0]?.url || '',
        itemName: item.name.en,
        price: item.masterVariant.prices?.[0]?.value.centAmount || 0,
        discount: item.masterVariant.prices?.[0]?.discounted?.value.centAmount,
      };

      new CardComponent(this.emitter).render(this.itemsMainWrapper, cardDto);
    });
    if (this.itemsMainWrapper.innerHTML === '') {
      this.itemsMainWrapper.textContent = 'Sorry, we dont have items like this';
    }
  }
}

export default CatalogCardsListComponent;
