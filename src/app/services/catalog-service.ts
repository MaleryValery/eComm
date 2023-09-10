import { Category, ProductProjection } from '@commercetools/platform-sdk';
import PriceRange from '../shared/types/price-range-type';
import AuthService from './auth-service';

class CatalogService {
  public static getMainCategories(): Promise<Category[]> {
    const methodArgs = {
      queryArgs: {
        expand: 'ancestors',
        where: 'ancestors IS EMPTY',
      },
    };

    AuthService.createApiRootAnonymous();
    AuthService.checkExistToken();
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

    return AuthService.apiRoot
      .categories()
      .get(methodArgs)
      .execute()
      .then((res) => res.body.results[0].id);
  }

  public static getCategoryById(id: string): Promise<Category> {
    const childPathArgs = { ID: id };

    return AuthService.apiRoot
      .categories()
      .withId(childPathArgs)
      .get()
      .execute()
      .then((res) => res.body);
  }

  public static getBrands(): Promise<string[]> {
    return AuthService.apiRoot
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

  public static getProducts(
    categoryIds?: string[],
    brands?: string[],
    priceRange?: PriceRange,
    sortArr?: string[],
    searchValue?: string
  ): Promise<ProductProjection[]> {
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

    const methodArgs = {
      queryArgs: {
        filter: filterArr,
        sort: sortArr,
        ...queryArgs,
      },
    };

    return AuthService.apiRoot
      .productProjections()
      .search()
      .get(methodArgs)
      .execute()
      .then((res) => res.body.results);
  }
}

export default CatalogService;
