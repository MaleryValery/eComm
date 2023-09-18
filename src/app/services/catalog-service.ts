import { Category, ProductProjection } from '@commercetools/platform-sdk';
import PriceRange from '../shared/types/price-range-type';
import maxCardsPerPage from '../consts/max-cards-per-page';
import AuthService from './auth-service';

class CatalogService {
  public static getMainCategories(): Promise<Category[] | void> {
    const methodArgs = {
      queryArgs: {
        expand: 'ancestors',
        where: 'ancestors IS EMPTY',
      },
    };

    if (!AuthService.apiRoot) AuthService.createApiRootAnonymous();
    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
      .categories()
      .get(methodArgs)
      .execute()
      .then((res) => res.body.results)
      .catch((err) => console.log((err as Error).message));
  }

  public static getChildrenCategories(parentCategoryId: string): Promise<Category[] | void> {
    const methodArgs = {
      queryArgs: {
        expand: 'ancestors',
        where: `ancestors(id="${parentCategoryId}")`,
      },
    };

    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
      .categories()
      .get(methodArgs)
      .execute()
      .then((res) => res.body.results)
      .catch((err) => console.log((err as Error).message));
  }

  public static getCaterogyIdByKey(categoryKey: string): Promise<string | void> {
    const methodArgs = {
      queryArgs: {
        where: `key="${categoryKey}"`,
      },
    };

    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
      .categories()
      .get(methodArgs)
      .execute()
      .then((res) => res.body.results[0].id)
      .catch((err) => console.log((err as Error).message));
  }

  public static getCategoryById(id: string): Promise<Category | void> {
    const childPathArgs = { ID: id };

    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
      .categories()
      .withId(childPathArgs)
      .get()
      .execute()
      .then((res) => res.body)
      .catch((err) => console.log((err as Error).message));
  }

  public static getBrands(): Promise<string[] | void> {
    const methodArgs = {
      queryArgs: {
        limit: 100,
      },
    };

    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
      .products()
      .get(methodArgs)
      .execute()
      .then((res) => {
        const products = res.body.results;
        const brands: string[] = products.map((product) => {
          const variant = product.masterData?.current?.masterVariant;
          const brandAttribute = variant?.attributes?.find((attribute) => attribute.name === 'brand');
          return brandAttribute ? brandAttribute.value : null;
        });
        return Array.from(new Set(brands));
      })
      .catch((err) => console.log((err as Error).message));
  }

  public static getPrices(): Promise<void | number[]> {
    const methodArgs = {
      queryArgs: {
        limit: 100,
      },
    };

    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
      .products()
      .get(methodArgs)
      .execute()
      .then((res) => {
        const products = res.body.results;
        const prices = products.map((product) => {
          const pricesArr = product.masterData.current.masterVariant.prices;
          return pricesArr ? pricesArr[0].value.centAmount : 0;
        });
        return prices;
      })
      .catch((err) => console.log((err as Error).message));
  }

  public static getProductsTotal(): Promise<number | void | undefined> {
    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
      .products()
      .get()
      .execute()
      .then((res) => res.body.total)
      .catch((err) => console.log((err as Error).message));
  }

  public static getProducts(
    categoryIds?: string[],
    brands?: string[],
    priceRange?: PriceRange,
    sortArr?: string[],
    searchValue?: string,
    paginationOffset?: number
  ): Promise<void | {
    results: ProductProjection[];
    total: number | undefined;
  }> {
    interface QueryArgs {
      [key: string]: unknown;
    }

    const filterArr = [];
    const queryArgs: QueryArgs = {};

    if (categoryIds && categoryIds.length > 0) {
      filterArr.push(`categories.id:"${categoryIds.join('","')}"`);
    }
    if (brands && brands.length > 0) {
      filterArr.push(`variants.attributes.brand:"${brands.join('","')}"`);
    }
    if (priceRange) {
      filterArr.push(`variants.price.centAmount:range (${priceRange.min * 100} to ${priceRange.max * 100})`);
    }
    if (searchValue && searchValue.length > 1) {
      queryArgs['text.en'] = searchValue;
    }
    if (paginationOffset) {
      queryArgs.offset = paginationOffset;
    }

    const methodArgs = {
      queryArgs: {
        filter: filterArr,
        sort: sortArr,
        ...queryArgs,
        limit: maxCardsPerPage,
      },
    };

    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
      .productProjections()
      .search()
      .get(methodArgs)
      .execute()
      .then((res) => {
        return {
          results: res.body.results,
          total: res.body.total,
        };
      })
      .catch((err) => console.log((err as Error).message));
  }
}

export default CatalogService;
