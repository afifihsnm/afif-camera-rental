export interface CartItem {
  id: number;
  product_id: number;
  title: string;
  image: string;
  rate_12h?: number;
  rate_24h: number;
  late_fee: number;
  qty: number;
  stock: number;
}
