import { ProductProjection } from '@commercetools/platform-sdk';
import PriceRange from '../types/price-range-type';

export default function findMinMaxPrices(items: ProductProjection[]): PriceRange {
  const prices = items.map((product) => {
    const { masterVariant } = product;
    if (masterVariant && masterVariant.prices) {
      const euroPrices = masterVariant.prices
        .filter((price) => price.value.currencyCode === 'EUR')
        .map((price) => (price.discounted ? price.discounted.value.centAmount : price.value.centAmount));
      return euroPrices;
    }
    return [];
  });

  const flatEuroPrices = prices.flat();

  const min = Math.min(...flatEuroPrices) / 100;
  const max = Math.max(...flatEuroPrices) / 100;

  return { min, max };
}
