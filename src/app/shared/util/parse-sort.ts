import SortOptions from '../../consts/sort-options';

export default function parseSort(value: string) {
  if (value === SortOptions.priceLowToHigh) return ['price asc'];
  if (value === SortOptions.priceHighToLow) return ['price desc'];
  if (value === SortOptions.nameAtoZ) return ['name.en asc'];
  if (value === SortOptions.nameZtoA) return ['name.en desc'];
  return [];
}
