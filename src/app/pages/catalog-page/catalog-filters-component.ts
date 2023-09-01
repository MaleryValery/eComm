import { Category, ProductProjection } from '@commercetools/platform-sdk';
import CatalogService from '../../services/catalog-service';
import CatalogController from '../../shared/util/catalog-controller';
import EventEmitter from '../../shared/util/emitter';
import BaseComponent from '../../shared/view/base-component';
import CustomInput from '../../shared/view/custom-input';
import createCategoryTree from '../../shared/util/create-category-tree';
import findMinMaxPrices from '../../shared/util/find-min-max-prices';

class CatalogFiltersComponent extends BaseComponent {
  private filtersWrapper!: HTMLElement;
  private searchEl!: HTMLInputElement;
  private categories!: HTMLElement;
  private price!: HTMLElement;
  private brands!: HTMLElement;
  private minPriceInput!: HTMLInputElement;
  private maxPriceInput!: HTMLInputElement;

  constructor(private catalogController: CatalogController, private eventEmitter: EventEmitter) {
    super(eventEmitter);
  }

  public render(parent: HTMLElement): void {
    this.filtersWrapper = BaseComponent.renderElem(parent, 'div', ['catalog-filters_wrapper']);

    this.searchEl = BaseComponent.renderElem(this.filtersWrapper, 'input', ['filters_search']) as HTMLInputElement;
    this.searchEl.placeholder = 'Search...';

    this.categories = BaseComponent.renderElem(this.filtersWrapper, 'div', ['filters_categories'], 'Categories:');
    this.renderCategories();

    this.price = BaseComponent.renderElem(this.filtersWrapper, 'div', ['filters_price'], 'Price');
    this.renderPrices();

    this.brands = BaseComponent.renderElem(this.filtersWrapper, 'div', ['filters_brands']);
    this.renderBrands();

    this.emitter.subscribe('updateBrands', (items: ProductProjection[]) => this.updateBrands(items));
    this.emitter.subscribe('updateCategories', (items: ProductProjection[]) => this.updateCategories(items));
  }
  // change to createCategoryTree after cross-check.
  private renderCategories() {
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
    const priceWrapper = BaseComponent.renderElem(this.price, 'div', ['price_wrapper']);
    this.minPriceInput = new CustomInput().render(priceWrapper, 'min-price', 'number', 'Min', false);
    this.maxPriceInput = new CustomInput().render(priceWrapper, 'max-price', 'number', 'Max', false);

    CatalogService.getProducts().then((res) => {
      const prices = findMinMaxPrices(res);

      this.minPriceInput.value = prices.min.toString();
      this.maxPriceInput.value = prices.max.toString();

      this.catalogController.setMinPrice(prices.min);
      this.catalogController.setMaxPrice(prices.max);
    });

    this.onChangePrices();
  }

  private onChangePrices() {
    this.price.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;

      if (target.id === 'min-price') {
        if (target.value === '') {
          target.value = '0';
        }
        if (Number(target.value) > Number(this.maxPriceInput.value)) {
          target.value = (Number(this.maxPriceInput.value) - 1).toString();
        }
        this.catalogController.setMinPrice(Number(target.value));
      }
      if (target.id === 'max-price') {
        if (Number(target.value) < Number(this.minPriceInput.value)) {
          target.value = (Number(this.minPriceInput.value) + 1).toString();
        }
        this.catalogController.setMaxPrice(Number(target.value));
      }
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

  private updateBrands(items: ProductProjection[]) {
    const brands = items
      .flatMap((item) => item.masterVariant.attributes)
      .filter((flatedItem) => flatedItem?.name === 'brand')
      .map((item) => item?.value);

    const uniqBrands = Array.from(new Set(brands));

    this.brands.innerHTML = '';

    const brandsList = BaseComponent.renderElem(this.brands, 'ul', ['brands_list'], 'Brands:');
    uniqBrands.forEach((brand) => {
      BaseComponent.renderElem(brandsList, 'li', ['brands_list_item'], brand);
    });
  }
}

export default CatalogFiltersComponent;
