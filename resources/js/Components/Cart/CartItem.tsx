import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import type { CartItem } from "@/types/cart";
import { Trash2 } from "lucide-react";
import type React from "react";

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove
}: CartItemProps) {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number.parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 rounded-lg bg-white p-4 shadow">
      <img
        src={`https://afif.camera-rental.soon.it/storage/${item.image || "placeholder.svg"}`}
        alt={item.title}
        width={100}
        height={100}
        className="rounded-md"
      />
      <div className="flex-grow">
        <h3 className="mb-1 text-lg font-semibold">
          <a href={`/product/${item.id}`} className="hover:underline">
            {item.title}
          </a>
        </h3>
        <p className="mb-1 text-sm text-gray-600">
          24-Hour Rate: Rp {item.rate_24h.toLocaleString("id-ID")}
          {item.rate_12h?.toLocaleString("id-ID") &&
            ` | 12-Hour Rate: Rp ${item.rate_12h.toLocaleString("id-ID")}`}
        </p>
        <p className="mb-2 text-sm text-gray-600">
          Late Fee: Rp {item.late_fee.toLocaleString("id-ID")}/day
        </p>
        <div className="flex items-center space-x-2">
          <label
            htmlFor={`quantity-${item.id}`}
            className="text-sm font-medium"
          >
            Quantity:
          </label>
          <Input
            id={`quantity-${item.id}`}
            type="number"
            min="1"
            max={item.stock}
            value={item.qty}
            onChange={handleQuantityChange}
            className="w-16"
          />
          <span className="text-sm text-gray-500">
            (Stock: {item.stock.toLocaleString("id-ID")})
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
        className="hover:bg-red-50"
      >
        <Trash2 className="h-5 w-5 text-red-500" />
      </Button>
    </div>
  );
}
