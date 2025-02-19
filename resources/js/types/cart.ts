export interface CartItem {
  id: string;
  title: string;
  image: string;
  rate_12h?: number;
  rate_24h: number;
  late_fee: number;
  qty: number;
  stock: number;
}
