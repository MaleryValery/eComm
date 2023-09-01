import EventEmitter from './emitter';
import CatalogService from '../../services/catalog-service';
import PriceRange from '../types/price-range-type';

class CatalogController {
  private activeCategories: string[] = [];
  private priceRange: PriceRange = { min: 0, max: 0 };
  private brands: string[] = [];

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

  public setMinPrice(value: number): void {
    this.priceRange.min = value;
    this.setFilteredItems();
  }

  public setMaxPrice(value: number): void {
    this.priceRange.max = value;
    this.setFilteredItems();
  }

  private setFilteredItems() {
    const categoryPromises = this.activeCategories.map((categoryKey) => {
      return CatalogService.getCaterogyIdByKey(categoryKey);
    });

    Promise.all(categoryPromises)
      .then((categoriesIds) => {
        CatalogService.getProducts(categoriesIds, this.brands, this.priceRange).then((res) => {
          this.emitter.emit('updateCards', res);
          if (this.brands.length === 0) this.emitter.emit('updateBrands', res);
          if (this.activeCategories.length === 0) this.emitter.emit('updateCategories', res);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export default CatalogController;
