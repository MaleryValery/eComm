import CatalogService from '../../services/catalog-service';
import ProductCard from '../../shared/types/product-card-type';
import CatalogController from './catalog-controller';
import EventEmitter from '../../shared/util/emitter';
import BaseComponent from '../../shared/view/base-component';
import CardComponent from './card-component';
import CustomSelect from '../../shared/view/custom-select';
import renderIcon from '../../shared/util/render-icon';
import SortOptions from '../../consts/sort-options';
import PaginationComponent from './pagination-component';
import ProductsResponse from '../../shared/types/products-response';

class CatalogCardsListComponent extends BaseComponent {
  private itemsMainWrapper!: HTMLElement;
  private searchEl!: HTMLInputElement;
  private categories!: HTMLElement;
  private price!: HTMLElement;
  private brands!: HTMLElement;
  private itemsCountEl!: HTMLElement;
  private sortEl!: HTMLElement;
  private filterIcon!: SVGSVGElement;
  private catalogCardsWrapper!: HTMLElement;
  private pagination!: PaginationComponent;
  private paginationContainer!: HTMLElement;

  constructor(private catalogController: CatalogController, private eventEmitter: EventEmitter) {
    super(eventEmitter);
  }

  render(parent: HTMLElement): void {
    const itemsWrapper = BaseComponent.renderElem(parent, 'div', ['catalog-list_wrapper']);

    const itemsHeader = BaseComponent.renderElem(itemsWrapper, 'div', ['catalog-header_wrapper']);

    const itemsHead = BaseComponent.renderElem(itemsHeader, 'div', ['catalog-header__head']);
    this.itemsCountEl = BaseComponent.renderElem(itemsHead, 'h2', ['catalog-header__name']);
    this.filterIcon = renderIcon(itemsHead, ['catalog-header__icon'], 'filter');

    this.sortEl = BaseComponent.renderElem(itemsHeader, 'div', ['catalog-header__sort']);
    this.renderSort();

    this.itemsMainWrapper = BaseComponent.renderElem(itemsWrapper, 'div', ['catalog-main_wrapper']);

    this.catalogCardsWrapper = BaseComponent.renderElem(this.itemsMainWrapper, 'div', ['catalog-cards_wrapper']);
    this.renderCards();

    this.paginationContainer = BaseComponent.renderElem(this.itemsMainWrapper, 'div', ['pagination-container']);
    this.renderPagination();

    this.emitter.subscribe('updateCards', (res: ProductsResponse) => this.updateCards(res));
  }

  private renderSort() {
    const sortOptions: SortOptions[] = Object.values(SortOptions);
    const select = new CustomSelect();
    select.render(this.sortEl, 'sort', 'Sort by:', sortOptions);
    select.setOnChangeCallback((selectedValue) => {
      this.catalogController.setSort(selectedValue);
    });
  }

  private updateItemsCounter(count: number) {
    this.itemsCountEl.textContent = `Products (${count})`;
  }

  private renderCards() {
    this.catalogCardsWrapper.innerHTML = '';

    CatalogService.getProducts().then((res) => {
      if (res.total) this.updateItemsCounter(res.total);
      res.results.forEach((item) => {
        const cardDto: ProductCard = {
          itemKey: item.key || '',
          imageUrl: item.masterVariant.images?.[0]?.url || '',
          itemName: item.name.en,
          price: item.masterVariant.prices?.[0]?.value.centAmount || 0,
          discount: item.masterVariant.prices?.[0]?.discounted?.value.centAmount,
        };

        new CardComponent(this.emitter).render(this.catalogCardsWrapper, cardDto);
      });
    });
  }

  private updateCards(res: ProductsResponse) {
    this.catalogCardsWrapper.innerHTML = '';
    if (res.total) this.updateItemsCounter(res.total);
    res.results.forEach((item) => {
      const cardDto: ProductCard = {
        itemKey: item.key || '',
        imageUrl: item.masterVariant.images?.[0]?.url || '',
        itemName: item.name.en,
        price: item.masterVariant.prices?.[0]?.value.centAmount || 0,
        discount: item.masterVariant.prices?.[0]?.discounted?.value.centAmount,
      };

      new CardComponent(this.emitter).render(this.catalogCardsWrapper, cardDto);
    });
    if (this.catalogCardsWrapper.innerHTML === '') {
      this.catalogCardsWrapper.textContent = `Sorry, we don't have items like this`;
      this.updateItemsCounter(0);
    }
  }

  private renderPagination() {
    this.pagination = new PaginationComponent(this.emitter);
    CatalogService.getProductsTotal().then((res) => {
      if (res) {
        this.pagination.render(this.paginationContainer, res);
        this.emitter.subscribe('setPaginationOffset', (pageNum: number) =>
          this.catalogController.setPaginationOffset(pageNum)
        );
      }
    });
  }
}

export default CatalogCardsListComponent;
