import CatalogService from '../../services/catalog-service';
import CatalogController from './catalog-controller';
import EventEmitter from '../../shared/util/emitter';
import BaseComponent from '../../shared/view/base-component';
import PriceRangeComponent from './price-range';

class CatalogFiltersComponent extends BaseComponent {
  private filtersWrapper!: HTMLElement;
  private searchEl!: HTMLInputElement;
  private categories!: HTMLElement;
  private price!: HTMLElement;
  private brands!: HTMLElement;
  private resetFiltersBtn!: HTMLElement;
  private activeCategoriesElements: Record<string, HTMLElement> = {};
  private activeBrandsElements: Record<string, HTMLElement> = {};
  private priceRangeComponent!: PriceRangeComponent;

  constructor(private catalogController: CatalogController, private eventEmitter: EventEmitter) {
    super(eventEmitter);
  }

  public render(parent: HTMLElement): void {
    this.filtersWrapper = BaseComponent.renderElem(parent, 'div', ['catalog-filters__wrapper']);
    this.onClickParams();

    this.searchEl = BaseComponent.renderElem(this.filtersWrapper, 'input', ['filters_search']) as HTMLInputElement;
    this.searchEl.placeholder = 'Search...';
    this.onChangeSearch();

    this.resetFiltersBtn = BaseComponent.renderElem(this.filtersWrapper, 'button', ['reset-btn'], 'reset filters');
    this.onClickResetFiltersBtn();

    this.categories = BaseComponent.renderElem(this.filtersWrapper, 'div', ['filters_categories']);
    this.renderCategories();

    this.price = BaseComponent.renderElem(this.filtersWrapper, 'div', ['filters_price']);
    this.renderPrices();

    this.brands = BaseComponent.renderElem(this.filtersWrapper, 'div', ['filters_brands']);
    this.renderBrands();

    const submitBtn = BaseComponent.renderElem(this.filtersWrapper, 'button', ['catalog-filters__submit'], 'Apply');
    submitBtn.setAttribute('data-btn-medium', '');

    this.emitter.subscribe('resetFilters', () => this.resetFilters());
  }

  private onChangeSearch() {
    this.searchEl.addEventListener('input', () => {
      this.catalogController.setSearchValue(this.searchEl.value);
    });
  }

  private onClickResetFiltersBtn() {
    this.resetFiltersBtn.addEventListener('click', () => {
      this.catalogController.resetFilters();
    });
  }

  private renderCategories() {
    BaseComponent.renderElem(this.categories, 'h3', ['filter-header'], 'Categories:');
    CatalogService.getMainCategories().then((res) => {
      res.forEach((parent) => {
        const categoryList = BaseComponent.renderElem(this.categories, 'ul', ['category-list']);
        const parentEl = BaseComponent.renderElem(
          categoryList,
          'li',
          ['category_item', 'parent-category'],
          parent.name.en
        );
        parentEl.dataset.key = parent.key;
        CatalogService.getChildrenCategories(parent.id).then((childRes) => {
          childRes.forEach((child) => {
            const childEl = BaseComponent.renderElem(
              categoryList,
              'li',
              ['category_item', 'child-category'],
              child.name.en
            );
            childEl.dataset.key = child.key;
          });
        });
      });
    });
    this.onChangeCategories();
  }

  private onChangeCategories() {
    this.categories.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.classList.contains('child-category')) {
        const isActive = target.classList.toggle('active-category');

        const dataKey = target.dataset.key || null;
        if (isActive) {
          this.catalogController.setActiveCategories(dataKey);
          this.activeCategoriesElements[dataKey as string] = target;
        } else {
          this.catalogController.removeActiveCategories(dataKey);
          delete this.activeCategoriesElements[dataKey as string];
        }
      }
    });
  }

  private renderPrices() {
    CatalogService.getPrices().then((res) => {
      const minPrice = Math.min(...res) / 100;
      const maxPrice = Math.max(...res) / 100;
      const defaultPriceRange = { min: minPrice, max: maxPrice };

      this.catalogController.setDefaultPriceRange(defaultPriceRange);

      BaseComponent.renderElem(this.price, 'h3', ['filter-header'], 'Prices:');
      this.priceRangeComponent = new PriceRangeComponent(this.emitter, this.catalogController, defaultPriceRange);
      this.priceRangeComponent.render(this.price);
    });
  }

  private renderBrands() {
    BaseComponent.renderElem(this.brands, 'h3', ['filter-header'], 'Brands:');
    CatalogService.getBrands().then((res) => {
      const brandsList = BaseComponent.renderElem(this.brands, 'ul', ['brands_list']);
      res.forEach((brand) => {
        BaseComponent.renderElem(brandsList, 'li', ['brands_list_item'], brand);
      });
    });

    this.onChangeBrands();
  }

  private onChangeBrands() {
    this.brands.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('brands_list_item')) {
        const isActive = target.classList.toggle('active-brand');

        const brandName = target.textContent;
        if (isActive) {
          this.catalogController.setActiveBrands(brandName);
          this.activeBrandsElements[brandName as string] = target;
        } else {
          this.catalogController.removeActiveBrands(brandName);
          delete this.activeBrandsElements[brandName as string];
        }
      }
    });
  }

  private onClickParams(): void {
    document.addEventListener('click', (e) => {
      const target: HTMLElement = e.target as HTMLElement;
      if (!target) return;

      if (
        (target as HTMLElement).classList.contains('catalog-header__icon') ||
        target.closest('.catalog-header__icon')
      ) {
        this.filtersWrapper.classList.toggle('catalog-filters__wrapper_active');
        document.body.classList.toggle('no-scroll_tablet');
      } else if (target.classList.contains('catalog-filters__submit')) {
        this.filtersWrapper.classList.remove('catalog-filters__wrapper_active');
        document.body.classList.remove('no-scroll_tablet');
      }
    });
  }

  private resetFilters() {
    Object.values(this.activeCategoriesElements).forEach((el) => el.classList.remove('active-category'));
    this.activeCategoriesElements = {};

    this.priceRangeComponent.resetSlider();

    Object.values(this.activeBrandsElements).forEach((el) => el.classList.remove('active-brand'));
    this.activeBrandsElements = {};
  }
}

export default CatalogFiltersComponent;
