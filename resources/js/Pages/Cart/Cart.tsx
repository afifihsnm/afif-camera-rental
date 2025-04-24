import CartItem from "@/Components/Cart/CartItem";
import PriceSummary from "@/Components/Cart/PriceSummary";
import { Button } from "@/Components/ui/button";
import { DateTimePicker } from "@/Components/ui/datetime-picker";
import AuthenticatedLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import type { CartItem as CartItemType } from "@/types/cart";
import { Link, router } from "@inertiajs/react";
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

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, qty: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    router.delete(route("cart.delete", id), {
      onSuccess: () => {
        // Remove the item from local state
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      },
      onError: (error) => {
        console.error("Error deleting cart item:", error);
        // Optionally, show an error message to the user
      }
    });
  };

  const calculateRentalCost = (item: CartItemType) => {
    if (!startDate || !endDate || endDate < startDate) return 0;

    // Calculate full hours difference (floor) like Carbon's diffInHours()
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const durationHours = Math.max(diffHours, 12);

    // 24h-only products
    if (!item.rate_12h) {
      const minimumHours = Math.max(durationHours, 24);
      const fullDays = Math.ceil(minimumHours / 24);
      return fullDays * item.rate_24h * item.qty;
    }

    // Products with 12h rates
    const totalBlocks = Math.ceil(durationHours / 12);
    const fullDays = Math.floor(totalBlocks / 2);
    const remainingBlocks = totalBlocks % 2;

    return (
      (fullDays * item.rate_24h + remainingBlocks * item.rate_12h) * item.qty
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + calculateRentalCost(item),
    0
  );

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      alert("Please select rental period");
      return;
    }

    if (endDate < startDate) {
      alert("End date must be after start date");
      return;
    }

    router.post("/rents", {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      cart_items: cartItems.map((item) => ({
        id: item.product_id,
        qty: item.qty
      }))
    });
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto min-h-screen px-4 py-8">
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
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
