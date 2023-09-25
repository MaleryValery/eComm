import EventEmitter from '../../shared/util/emitter';
import CatalogService from '../../services/catalog-service';
import PriceRange from '../../shared/types/price-range-type';
import parseSort from '../../shared/util/parse-sort';
import maxCardsPerPage from '../../consts/max-cards-per-page';
import Loader from '../../shared/view/loader/loader';

class CatalogController {
  private activeCategories: string[] = [];
  private priceRange: PriceRange = { min: 0, max: 0 };
  private brands: string[] = [];
  private sort: string[] = [];
  private searchValue = '';
  private paginationOffset = 0;
  private defaultPriceRange: PriceRange = { min: 0, max: 0 };

  constructor(private emitter: EventEmitter, private loader: Loader) {}

  public setDefaultPriceRange(defaultPriceRanges: PriceRange): void {
    this.defaultPriceRange = defaultPriceRanges;
    this.priceRange = this.defaultPriceRange;
  }

  public getDefaultPriceRange(): PriceRange {
    return this.defaultPriceRange;
  }

  public resetFilters(): void {
    this.activeCategories = [];
    this.priceRange = this.defaultPriceRange;
    this.brands = [];
    this.searchValue = '';
    this.paginationOffset = 0;

    this.emitter.emit('resetFilters', undefined);
    this.setFilteredItems();
  }

  public setActiveCategories(value: string | null): void {
    if (value) this.activeCategories.push(value);
    this.setFilteredItems();
  }

  public removeActiveCategories(value: string | null): void {
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

  public setPaginationOffset(pageNum: number) {
    this.paginationOffset = (pageNum - 1) * maxCardsPerPage;
    this.setFilteredItems();
  }

  public setFilteredItems() {
    const categoryPromises = this.activeCategories.map((categoryKey) => {
      return CatalogService.getCaterogyIdByKey(categoryKey);
    });

    this.loader.show();

    Promise.all(categoryPromises)
      .then((categoriesIds) => {
        const validCategoryIds = categoriesIds.includes(undefined) ? undefined : (categoriesIds as string[]);
        CatalogService.getProducts(
          validCategoryIds,
          this.brands,
          this.priceRange,
          this.sort,
          this.searchValue,
          this.paginationOffset
        ).then((res) => {
          this.emitter.emit('updateCards', res);
          this.emitter.emit('updatePagination', res?.total);
          this.loader.hide();
        });
      })
      .catch((error) => {
        this.loader.hide();
        console.error(error);
      });
  }
}

export default CatalogController;
