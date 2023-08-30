import { ProductProjection } from '@commercetools/platform-sdk';

class CatalogController {
  private activeCategories: string[] = [];
  private priceRange = { min: 0, max: 1000 };
  private brands: string[] = [];
  private items!: ProductProjection[];

  public setActiveCaregoties(value: string | null): void {
    if (value !== null) this.activeCategories.push(value);
  }

  public removeActiveCaregoties(value: string | null): void {
    if (value !== null) this.activeCategories = this.activeCategories.filter((item) => item !== value);
  }

  public setActiveBrands(value: string | null): void {
    if (value !== null) this.brands.push(value);
  }

  public removeActiveBrands(value: string | null): void {
    if (value !== null) this.brands = this.brands.filter((item) => item !== value);
  }

  public setMinPrice(value: number): void {
    this.priceRange.min = value;
  }

  public setMaxPrice(value: number): void {
    this.priceRange.max = value;
  }
}

export default CatalogController;
