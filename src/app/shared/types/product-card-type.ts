export default interface ProductCard {
  itemKey: string;
  imageUrl: string;
  itemName: string;
  price: number;
  itemId: string;
  itemIdInCart?: string;
  discount?: number;
  pricePromo?: number;
  description?: string;
  qtyInCart?: number;
  priceInCart?: number;
}
