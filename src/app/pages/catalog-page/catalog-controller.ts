import EventEmitter from '../../shared/util/emitter';
import CatalogService from '../../services/catalog-service';
import PriceRange from '../../shared/types/price-range-type';
import parseSort from '../../shared/util/parse-sort';
import Loader from '../../shared/util/loader';

class CatalogController {
  private activeCategories: string[] = [];
  private priceRange: PriceRange = { min: 0, max: 0 };
  private brands: string[] = [];
  private sort: string[] = [];
  private searchValue = '';

  constructor(private emitter: EventEmitter, private loader: Loader) {}

  public setActiveCaregoties(value: string | null): void {
    if (value) this.activeCategories.push(value);
    this.setFilteredItems();
  }

  public removeActiveCaregoties(value: string | null): void {
    if (value) this.activeCategories = this.activeCategories.filter((item) => item !== value);
    this.setFilteredItems();
  }

  public setActiveBrands(value: string | null): void {
    if (value) this.brands.push(value);
    this.setFilteredItems();
  }

  public removeActiveBrands(value: string | null): void {
    if (value) this.brands = this.brands.filter((item) => item !== value);
    this.setFilteredItems();
  }

  public setPriceRange(value: PriceRange): void {
    this.priceRange = value;
    this.setFilteredItems();
  }

  public setSort(value: string) {
    this.sort = parseSort(value);
    this.setFilteredItems();
  }

  public setSearchValue(value: string) {
    this.searchValue = value;
    this.setFilteredItems();
  }

  private setFilteredItems() {
    const categoryPromises = this.activeCategories.map((categoryKey) => {
      return CatalogService.getCaterogyIdByKey(categoryKey);
    });

    this.loader.show();
    document.body.classList.add('no-scroll');

    Promise.all(categoryPromises)
      .then((categoriesIds) => {
        CatalogService.getProducts(categoriesIds, this.brands, this.priceRange, this.sort, this.searchValue).then(
          (res) => {
            this.emitter.emit('updateCards', res);
            if (this.brands.length === 0) this.emitter.emit('updateBrands', res);
            if (this.activeCategories.length === 0) this.emitter.emit('updateCategories', res);
            this.loader.hide();
            document.body.classList.remove('no-scroll');
          }
        );
      })
      .catch((error) => {
        this.loader.hide();
        console.error(error);
      });
  }
}

export default CatalogController;
