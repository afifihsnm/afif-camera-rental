import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";

interface PriceSummaryProps {
  subtotal: number;
  startDate: Date;
  endDate: Date;
  onSubmit: () => void;
}

export default function PriceSummary({
  subtotal,
  startDate,
  endDate,
  onSubmit
}: PriceSummaryProps) {
  // For this example, we'll assume a fixed tax rate of 10%
  const total = subtotal;

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Price Summary</h2>
      <div className="space-y-2">
        <div className="mb-2 text-sm text-gray-600">
          <p>From: {formatDate(startDate)}</p>
          <p>To: {formatDate(endDate)}</p>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Total Rental Cost</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
      </div>
      <Button onClick={onSubmit} className="mt-6 w-full">
        Rent Now
      </Button>
    </div>
  );
}
