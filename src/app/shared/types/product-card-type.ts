export default interface ProductCard {
  itemKey: string;
  imageUrl: string;
  itemName: string;
  price: number;
  itemId?: string;
  discount?: number;
  description?: string;
  qtyInCart?: number;
  priceInCart?: number;
}
