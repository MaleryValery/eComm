import { Category, ProductProjection } from '@commercetools/platform-sdk';
import CatalogService from '../../services/catalog-service';
import CatalogController from './catalog-controller';
import EventEmitter from '../../shared/util/emitter';
import BaseComponent from '../../shared/view/base-component';
import createCategoryTree from '../../shared/util/create-category-tree';
import PriceRangeComponent from './price-range';

class CatalogFiltersComponent extends BaseComponent {
  private filtersWrapper!: HTMLElement;
  private searchEl!: HTMLInputElement;
  private categories!: HTMLElement;
  private price!: HTMLElement;
  private brands!: HTMLElement;

  constructor(private catalogController: CatalogController, private eventEmitter: EventEmitter) {
    super(eventEmitter);
  }

  public render(parent: HTMLElement): void {
    this.filtersWrapper = BaseComponent.renderElem(parent, 'div', ['catalog-filters__wrapper']);
    this.onClickParams();

    this.searchEl = BaseComponent.renderElem(this.filtersWrapper, 'input', ['filters_search']) as HTMLInputElement;
    this.searchEl.placeholder = 'Search...';
    this.onChangeSearch();

    this.categories = BaseComponent.renderElem(this.filtersWrapper, 'div', ['filters_categories']);
    this.renderCategories();

    this.price = BaseComponent.renderElem(this.filtersWrapper, 'div', ['filters_price']);
    this.renderPrices();

    this.brands = BaseComponent.renderElem(this.filtersWrapper, 'div', ['filters_brands']);
    this.renderBrands();

    const submitBtn = BaseComponent.renderElem(this.filtersWrapper, 'button', ['catalog-filters__submit'], 'Apply');
    submitBtn.setAttribute('data-btn-medium', '');

    this.emitter.subscribe('updateBrands', (items: ProductProjection[]) => this.updateBrands(items));
    this.emitter.subscribe('updateCategories', (items: ProductProjection[]) => this.updateCategories(items));
  }

  private onChangeSearch() {
    this.searchEl.addEventListener('input', () => {
      this.catalogController.setSearchValue(this.searchEl.value);
    });
  }

  // change to createCategoryTree after cross-check.
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
          this.catalogController.setActiveCaregoties(dataKey);
        } else {
          this.catalogController.removeActiveCaregoties(dataKey);
        }
      }
    });
  }

  private updateCategories(items: ProductProjection[]) {
    this.categories.innerHTML = '';
    const categories = items.flatMap((item) => item.categories.map((category) => category.id));
    const uniqueCategories = Array.from(new Set(categories));

    const promises = uniqueCategories.map((category) => CatalogService.getCategoryById(category));

    Promise.all(promises).then((res) => {
      this.categories.innerHTML = '';
      BaseComponent.renderElem(this.categories, 'h3', ['filter-header'], 'Categories:');
      const categoryTree = createCategoryTree(res);
      categoryTree.forEach((category) => {
        const categoryList = BaseComponent.renderElem(this.categories, 'ul', ['category-list']);
        const parentEl = BaseComponent.renderElem(
          categoryList,
          'li',
          ['category_item', 'parent-category'],
          category.parent.name.en
        );
        parentEl.dataset.key = category.parent.key;
        category.children.forEach((child) => {
          const childCategory = child as Category;
          const childEl = BaseComponent.renderElem(
            categoryList,
            'li',
            ['category_item', 'child-category'],
            childCategory.name.en
          );
          childEl.dataset.key = childCategory.key;
        });
      });
    });
  }

  private renderPrices() {
    BaseComponent.renderElem(this.price, 'h3', ['filter-header'], 'Prices:');
    CatalogService.getProducts().then((res) => {
      new PriceRangeComponent(this.catalogController, res).render(this.price);
    });
  }

  private renderBrands() {
    CatalogService.getBrands().then((res) => {
      const brandsList = BaseComponent.renderElem(this.brands, 'ul', ['brands_list'], 'Brands:');
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
        } else {
          this.catalogController.removeActiveBrands(brandName);
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

  private updateBrands(items: ProductProjection[]) {
    const brands = items
      .flatMap((item) => item.masterVariant.attributes)
      .filter((flatedItem) => flatedItem?.name === 'brand')
      .map((item) => item?.value);

    const uniqBrands = Array.from(new Set(brands));

    this.brands.innerHTML = '';

    BaseComponent.renderElem(this.brands, 'h3', ['filter-header'], 'Brands:');
    const brandsList = BaseComponent.renderElem(this.brands, 'ul', ['brands_list']);
    uniqBrands.forEach((brand) => {
      BaseComponent.renderElem(brandsList, 'li', ['brands_list_item'], brand);
    });
  }
}

export default CatalogFiltersComponent;
