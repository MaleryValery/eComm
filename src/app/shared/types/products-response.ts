import { ProductProjection } from '@commercetools/platform-sdk';

interface ProductsResponse {
  results: ProductProjection[];
  total?: number;
}

export default ProductsResponse;
