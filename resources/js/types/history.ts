interface RentalProduct {
  id: number;
  name: string;
  image: string;
  rate24Hour: number;
  rate12Hour?: number;
  quantity: number;
}

export interface Rental {
  id: number;
  startDate: Date;
  endDate: Date;
  returnedDate?: Date;
  status: number;
  products: RentalProduct[];
  subtotal: number;
  total: number;
}
