import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/Components/ui/alert-dialog";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import Authenticated from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { Rental } from "@/types/history";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { Calendar, Clock, MoveRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface HistoryProps extends PageProps {
  rentals: Rental[];
}

const StatusBadge = ({ status }: { status: Rental["status"] }) => {
  const STATUS_MAPPING: Record<number, { label: string; className: string }> = {
    0: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    },
    1: {
      label: "Confirmed",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100"
    },
    2: {
      label: "Rented",
      className: "bg-purple-100 text-purple-800 hover:bg-purple-100"
    },
    3: {
      label: "Returned",
      className: "bg-orange-100 text-orange-800 hover:bg-orange-100"
    },
    4: {
      label: "Completed",
      className: "bg-green-100 text-green-800 hover:bg-green-100"
    },
    5: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 hover:bg-red-100"
    },
    6: {
      label: "Unresolved",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  };

  return (
    <Badge variant="secondary" className={STATUS_MAPPING[status].className}>
      {STATUS_MAPPING[status].label}
    </Badge>
  );
};

export default function History({ rentals }: HistoryProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelClick = (rentalId: number) => {
    setSelectedRentalId(rentalId);
    setOpenDialog(true);
  };

  const handleCancel = () => {
    if (!selectedRentalId) return;

    setIsLoading(true);
    router.post(
      route("rent.cancel", { id: selectedRentalId }),
      {},
      {
        onSuccess: () => {
          setIsLoading(false);
          setOpenDialog(false);
          toast.success("Rental has been cancelled successfully");
        },
        onError: () => {
          setIsLoading(false);
          toast.error("Failed to cancel rental");
        }
      }
    );
  };

  return (
    <Authenticated>
      <div className="container mx-auto min-h-screen p-4 md:p-6">
        <div className="grid gap-6 xl:grid-cols-2">
          {rentals.map((rental) => (
            <Card key={rental.id} className="flex flex-col overflow-hidden">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Rental ID: #{rental.id}</div>
                  <StatusBadge status={rental.status} />
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(rental.startDate, "MMMM d, yyyy h:mm a")}
                    </span>
                    <MoveRight className="h-4 w-4" />
                    <span>{format(rental.endDate, "MMMM d, yyyy h:mm a")}</span>
                  </div>
                  {rental.returnedDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        Returned:{" "}
                        {format(rental.returnedDate, "MMMM d, yyyy h:mm a")}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col space-y-6">
                <div className="flex-1 space-y-4">
                  {rental.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-start gap-4 rounded-lg border p-3"
                    >
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                        <img
                          src={`https://afif.camera-rental.soon.it/storage/${product.image || "placeholder.svg"}`}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          <div>
                            24-Hour: Rp{" "}
                            {product.rate24Hour.toLocaleString("id-ID")}
                          </div>
                          {product.rate12Hour && (
                            <div>
                              12-Hour Fee: $
                              {product.rate12Hour.toLocaleString("id-ID")}
                            </div>
                          )}
                          <div>
                            Quantity: {product.quantity.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto">
                  <Separator className="mb-6" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>Rp {rental.subtotal.toLocaleString("id-ID")}</span>
                    </div>

                    {rental.total !== rental.subtotal && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Additional Fees</span>
                        <span>
                          Rp{" "}
                          {(rental.total - rental.subtotal).toLocaleString(
                            "id-ID"
                          )}
                        </span>
                      </div>
                    )}

                    <div
                      className={`flex justify-between font-medium ${rental.total !== rental.subtotal ? "border-t pt-1" : ""}`}
                    >
                      <span>Total</span>
                      <span>Rp {rental.total.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {(rental.status === 0 || rental.status === 1) && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleCancelClick(rental.id)}
                  >
                    Cancel Rent
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Rental</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this rental? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, keep it</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600"
                disabled={isLoading}
              >
                {isLoading ? "Cancelling..." : "Yes, cancel rental"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Authenticated>
  );
}
