import { ProductProjection } from '@commercetools/platform-sdk';
import CatalogService from '../../services/catalog-service';
import ProductCard from '../../shared/types/product-card-type';
import CatalogController from './catalog-controller';
import EventEmitter from '../../shared/util/emitter';
import BaseComponent from '../../shared/view/base-component';
import CardComponent from './card-component';
import CustomSelect from '../../shared/view/custom-select';
import renderIcon from '../../shared/util/render-icon';

class CatalogCardsListComponent extends BaseComponent {
  private itemsMainWrapper!: HTMLElement;
  private searchEl!: HTMLInputElement;
  private categories!: HTMLElement;
  private price!: HTMLElement;
  private brands!: HTMLElement;
  private itemsCounter!: HTMLElement;
  private sortEl!: HTMLElement;
  private filterIcon!: SVGSVGElement;

  constructor(private catalogController: CatalogController, private eventEmitter: EventEmitter) {
    super(eventEmitter);
  }

  render(parent: HTMLElement): void {
    const itemsWrapper = BaseComponent.renderElem(parent, 'div', ['catalog-list_wrapper']);

    const itemsHeader = BaseComponent.renderElem(itemsWrapper, 'div', ['catalog-header_wrapper']);

    const itemsHead = BaseComponent.renderElem(itemsHeader, 'div', ['catalog-header__head']);
    this.itemsCounter = BaseComponent.renderElem(itemsHead, 'h2', ['catalog-header__name']);
    this.filterIcon = renderIcon(itemsHead, ['catalog-header__icon'], 'filter');

    this.sortEl = BaseComponent.renderElem(itemsHeader, 'div', ['catalog-header__sort']);
    this.renderSort();

    this.itemsMainWrapper = BaseComponent.renderElem(itemsWrapper, 'div', ['catalog-main_wrapper']);
    this.renderCards();

    this.emitter.subscribe('updateCards', (items: ProductProjection[]) => this.updateCards(items));
  }

  private renderSort() {
    const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Name: A to Z', 'Name: Z to A'];
    const select = new CustomSelect();
    select.render(this.sortEl, 'sort', 'Sort by:', sortOptions);
    select.setOnChangeCallback((selectedValue) => {
      this.catalogController.setSort(selectedValue);
    });
  }

  private updateItemsCounter(count: number) {
    this.itemsCounter.textContent = `Products (${count})`;
  }

  private renderCards() {
    this.itemsMainWrapper.innerHTML = '';

    CatalogService.getProducts().then((res) => {
      this.updateItemsCounter(res.length);
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
    this.updateItemsCounter(items.length);
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
