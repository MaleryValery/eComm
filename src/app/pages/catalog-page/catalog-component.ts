import CatalogService from '../../services/catalog-service';
import BaseComponent from '../../shared/view/base-component';
import CustomInput from '../../shared/view/custom-input';
import RouteComponent from '../../shared/view/route-component';
import './catalog-component.scss';
import CatalogController from '../../shared/util/catalog-controller';
import CardComponent from '../../shared/view/card-component';
import EventEmitter from '../../shared/util/emitter';

class CatalogComponent extends RouteComponent {
  private EventEmitter = new EventEmitter();
  private catalogController = new CatalogController();
  private catalogContainer!: HTMLElement;

  private filtersWrapper!: HTMLElement;

  private searchEl!: HTMLInputElement;
  private categories!: HTMLElement;
  private price!: HTMLElement;
  private brands!: HTMLElement;

  private categoryName!: HTMLElement;
  private sortEl!: HTMLElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('catalog-route');
    this.catalogContainer = BaseComponent.renderElem(this.container, 'div', ['catalog_wrapper']);

    this.renderFilters();
    this.renderList();
  }

  private renderFilters() {
    this.filtersWrapper = BaseComponent.renderElem(this.catalogContainer, 'div', ['catalog-filters_wrapper']);

    this.searchEl = BaseComponent.renderElem(this.filtersWrapper, 'input', ['filters_search']) as HTMLInputElement;
    this.searchEl.placeholder = 'Search...';

    this.categories = BaseComponent.renderElem(this.filtersWrapper, 'div', ['filters_categories'], 'Categories:');
    this.renderCategories();

    this.price = BaseComponent.renderElem(this.filtersWrapper, 'div', ['filters_price'], 'Price');
    this.renderPrices();

    this.brands = BaseComponent.renderElem(this.filtersWrapper, 'div', ['filters_brands']);
    this.renderBrands();
  }

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

  private renderPrices() {
    CatalogService.getMinMaxPrices().then((res) => {
      const priceWrapper = BaseComponent.renderElem(this.price, 'div', ['price_wrapper']);
      const minPriceInput = new CustomInput().render(priceWrapper, 'min-price', 'number', 'Min', false);
      const maxPriceInput = new CustomInput().render(priceWrapper, 'max-price', 'number', 'Max', false);
      minPriceInput.value = (res.min / 100).toString();
      maxPriceInput.value = (res.max / 100).toString();
    });

    this.onChangePrices();
  }

  private onChangePrices() {
    this.price.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;

      if (target.id === 'min-price') {
        this.catalogController.setMinPrice(Number(target.value));
      }
      if (target.id === 'max-price') {
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

  private renderList() {
    const itemsWrapper = BaseComponent.renderElem(this.catalogContainer, 'div', ['catalog-list_wrapper']);

    const itemsHeader = BaseComponent.renderElem(itemsWrapper, 'div', ['catalog-header_wrapper']);
    this.categoryName = BaseComponent.renderElem(itemsHeader, 'span', ['catalog-header__name']);
    this.sortEl = BaseComponent.renderElem(itemsHeader, 'div', ['catalog-header__sort']);

    const itemsMain = BaseComponent.renderElem(itemsWrapper, 'div', ['catalog-main_wrapper']);
    this.renderCards(itemsMain);
  }

  private renderCards(parent: HTMLElement) {
    // eslint-disable-next-line no-param-reassign
    parent.innerHTML = '';
    CatalogService.getProducts().then((res) => {
      const items = res.slice(0, 6);
      console.log(items[0].key);
      items.forEach((item) => {
        const imageUrl = item.masterVariant.images?.[0]?.url || '';
        const priceAmount = item.masterVariant.prices?.[0]?.value.centAmount || 0;
        const discount = item.masterVariant.prices?.[0]?.discounted?.value.centAmount;
        const itemKey = item.key || '';

        new CardComponent(this.EventEmitter).render(parent, itemKey, imageUrl, item.name.en, priceAmount, discount);
      });
    });
  }
}

export default CatalogComponent;
