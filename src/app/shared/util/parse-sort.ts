export default function parseSort(value: string) {
  if (value === 'Price: Low to High') return ['price asc'];
  if (value === 'Price: High to Low') return ['price desc'];
  if (value === 'Name: A to Z') return ['name.en asc'];
  if (value === 'Name: Z to A') return ['name.en desc'];
  return [];
}
