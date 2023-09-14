import { Category, ProductProjection } from '@commercetools/platform-sdk';
import PriceRange from '../shared/types/price-range-type';
import maxCardsPerPage from '../consts/max-cards-per-page';
import AuthService from './auth-service';

class CatalogService {
  public static getMainCategories(): Promise<Category[]> {
    const methodArgs = {
      queryArgs: {
        expand: 'ancestors',
        where: 'ancestors IS EMPTY',
      },
    };

    if (!AuthService.apiRoot) AuthService.createApiRootAnonymous();
    // AuthService.checkExistToken();
    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
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

    // AuthService.checkExistToken();
    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
      .categories()
      .get(methodArgs)
      .execute()
      .then((res) => res.body.results);
  }

  public static getCaterogyIdByKey(categoryKey: string): Promise<string> {
    const methodArgs = {
      queryArgs: {
        where: `key="${categoryKey}"`,
      },
    };

    // AuthService.checkExistToken();
    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
      .categories()
      .get(methodArgs)
      .execute()
      .then((res) => res.body.results[0].id);
  }

  public static getCategoryById(id: string): Promise<Category> {
    const childPathArgs = { ID: id };

    // AuthService.checkExistToken();
    AuthService.checkRefreshtToken();
    return AuthService.apiRoot
      .categories()
      .withId(childPathArgs)
      .get()
      .execute()
      .then((res) => res.body);
  }

  public static getBrands(): Promise<string[]> {
    const methodArgs = {
      queryArgs: {
        limit: 100,
      },
    };

    // AuthService.checkExistToken();
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
      });
  }

  public static getPrices(): Promise<number[]> {
    const methodArgs = {
      queryArgs: {
        limit: 100,
      },
    };

    // AuthService.checkExistToken();
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
      });
  }

  public static getProductsTotal(): Promise<number | undefined> {
    AuthService.checkExistToken();
    return AuthService.apiRoot
      .products()
      .get()
      .execute()
      .then((res) => res.body.total);
  }

  public static getProducts(
    categoryIds?: string[],
    brands?: string[],
    priceRange?: PriceRange,
    sortArr?: string[],
    searchValue?: string,
    paginationOffset?: number
  ): Promise<{
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

    // AuthService.checkExistToken();
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
      });
  }
}

export default CatalogService;
