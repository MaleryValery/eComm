import EventEmitter from '../../shared/util/emitter';
import CatalogService from '../../services/catalog-service';
import PriceRange from '../../shared/types/price-range-type';
import parseSort from '../../shared/util/parse-sort';
import maxCardsPerPage from '../../consts/max-cards-per-page';

class CatalogController {
  private activeCategories: string[] = [];
  private priceRange: PriceRange = { min: 0, max: 0 };
  private brands: string[] = [];
  private sort: string[] = [];
  private searchValue = '';
  private paginationOffset = 0;

  constructor(private emitter: EventEmitter) {}

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

  public setPaginationOffset(pageNum: number) {
    this.paginationOffset = (pageNum - 1) * maxCardsPerPage;
    this.setFilteredItems();
  }

  private setFilteredItems() {
    const categoryPromises = this.activeCategories.map((categoryKey) => {
      return CatalogService.getCaterogyIdByKey(categoryKey);
    });

    Promise.all(categoryPromises)
      .then((categoriesIds) => {
        CatalogService.getProducts(
          categoriesIds,
          this.brands,
          this.priceRange,
          this.sort,
          this.searchValue,
          this.paginationOffset
        ).then((res) => {
          this.emitter.emit('updateCards', res);
          this.emitter.emit('updatePagination', res.total);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export default CatalogController;
