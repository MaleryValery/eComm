import { Category, ProductProjection } from '@commercetools/platform-sdk';
import { anonymApiRoot } from '../shared/util/client-builder';

class CatalogService {
  public static getMainCategories(): Promise<Category[]> {
    const methodArgs = {
      queryArgs: {
        expand: 'ancestors',
        where: 'ancestors IS EMPTY',
      },
    };

    return anonymApiRoot
      .categories()
      .get(methodArgs)
      .execute()
      .then((res) => res.body.results);
  }

  public static getChildrenCategories(parentCategoryId: string): Promise<Category[]> {
    const methodArgs = {
      queryArgs: {
        expand: 'ancestors',
        where: `ancestors(id="${parentCategoryId}")`,
      },
    };

    return anonymApiRoot
      .categories()
      .get(methodArgs)
      .execute()
      .then((res) => res.body.results);
  }

  public static getMinMaxPrices(): Promise<{
    min: number;
    max: number;
  }> {
    return anonymApiRoot
      .products()
      .get()
      .execute()
      .then((res) => {
        const prices = res.body.results.map((product) => {
          const { masterVariant } = product.masterData.current;
          if (masterVariant && masterVariant.prices) {
            const euroPrices = masterVariant.prices
              .filter((price) => price.value.currencyCode === 'EUR')
              .map((price) => price.value.centAmount);
            return euroPrices;
          }
          return [];
        });

        const flatEuroPrices = prices.flat();

        const min = Math.min(...flatEuroPrices);
        const max = Math.max(...flatEuroPrices);

        return { min, max };
      });
  }

  public static getCaterogyIdByKey(categoryKey: string): Promise<string> {
    const methodArgs = {
      queryArgs: {
        where: `key="${categoryKey}"`,
      },
    };

    return anonymApiRoot
      .categories()
      .get(methodArgs)
      .execute()
      .then((res) => res.body.results[0].id);
  }

  public static getBrands(): Promise<string[]> {
    return anonymApiRoot
      .products()
      .get()
      .execute()
      .then((res) => {
        const products = res.body.results;
        const brands: string[] = products.map((product) => {
          const variant = product.masterData?.current?.masterVariant;
          const brandAttribute = variant?.attributes?.find((attribute) => attribute.name === 'brand');
          return brandAttribute ? brandAttribute.value : null;
        });
        return Array.from(new Set(brands));
      });
  }

  public static getProducts(categoryIds?: string[], brands?: string[]): Promise<ProductProjection[]> {
    const filterArr = [];
    if (categoryIds && categoryIds?.length > 0) {
      filterArr.push(`categories.id:"${categoryIds.join('","')}"`);
    }
    if (brands && brands.length > 0) {
      filterArr.push(`variants.attributes.brand:"${brands.join('","')}"`);
    }

    const methodArgs =
      filterArr.length > 0
        ? {
            queryArgs: {
              filter: filterArr,
            },
          }
        : {};

    return anonymApiRoot
      .productProjections()
      .search()
      .get(methodArgs)
      .execute()
      .then((res) => res.body.results);
  }
}

export default CatalogService;
