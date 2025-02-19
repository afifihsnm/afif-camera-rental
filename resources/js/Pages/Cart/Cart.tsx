import CartItem from "@/Components/Cart/CartItem";
import PriceSummary from "@/Components/Cart/PriceSummary";
import { Button } from "@/Components/ui/button";
import { DateTimePicker } from "@/Components/ui/datetime-picker";
import AuthenticatedLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import type { CartItem as CartItemType } from "@/types/cart";
import { Link } from "@inertiajs/react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface CartProps extends PageProps {
  cartItemsData: CartItemType[];
}

export default function Cart({ cartItemsData }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItemType[]>(cartItemsData);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, qty: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateRentalCost = (item: CartItemType) => {
    if (!startDate || !endDate) return 0;

    const durationHours =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    let rate = item.rate_24h / 24; // Convert 24-hour rate to hourly rate

    if (item.rate_12h && durationHours <= 12) {
      rate = item.rate_12h / 12; // Use 12-hour rate if available and duration is 12 hours or less
    }

    return rate * durationHours * item.qty;
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + calculateRentalCost(item),
    0
  );

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 flex items-center gap-2 text-3xl font-bold">
          <ShoppingCart className="h-8 w-8" />
          Your Rental Cart
        </h1>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <div className="mb-4 rounded-lg bg-white p-4 shadow">
              <h2 className="mb-4 text-xl font-semibold">Rental Period</h2>
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">
                    Start Date/Time:
                  </label>
                  <DateTimePicker
                    value={startDate}
                    onChange={setStartDate}
                    // dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">
                    End Date/Time:
                  </label>
                  <DateTimePicker
                    value={endDate}
                    onChange={setEndDate}
                    // dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
            {cartItems.length === 0 && (
              <p className="py-8 text-center text-gray-500">
                Your cart is empty.
              </p>
            )}
            <Link href="/search">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
              </Button>
            </Link>
          </div>
          <div className="md:col-span-1">
            <PriceSummary
              subtotal={subtotal}
              startDate={startDate ?? new Date()}
              endDate={endDate ?? new Date()}
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
