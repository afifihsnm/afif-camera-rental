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
import { format } from "date-fns";
import { Calendar, Clock, MoveRight } from "lucide-react";

// Example data based on the requirements
// const rentals: Rental[] = [
//   {
//     id: "#101",
//     startDate: new Date("2025-03-01T10:00:00"),
//     endDate: new Date("2025-03-04T10:00:00"),
//     status: 1,
//     products: [
//       {
//         id: "canon-r5",
//         name: "Canon EOS R5",
//         imageUrl:
//           "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-02-18%2012-35-47-2IVdKMvkqnXGRPIeFPEagQGZ31qOo5.png",
//         rate24Hour: 25,
//         rate12Hour: 15,
//         quantity: 1
//       },
//       {
//         id: "sony-a7iii",
//         name: "Sony A7 III",
//         imageUrl:
//           "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-02-18%2012-35-47-2IVdKMvkqnXGRPIeFPEagQGZ31qOo5.png",
//         rate24Hour: 20,
//         quantity: 2
//       }
//     ],
//     subtotal: 210,
//     total: 210
//   },
//   {
//     id: "#102",
//     startDate: new Date("2025-02-15T09:00:00"),
//     endDate: new Date("2025-02-18T09:00:00"),
//     returnedDate: new Date("2025-02-18T15:00:00"),
//     status: 2,
//     products: [
//       {
//         id: "nikon-z7ii",
//         name: "Nikon Z7 II",
//         imageUrl:
//           "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-02-18%2012-35-47-2IVdKMvkqnXGRPIeFPEagQGZ31qOo5.png",
//         rate24Hour: 30,
//         quantity: 1
//       }
//     ],
//     subtotal: 90,
//     total: 100,
//     lateFee: 10
//   }
// ];

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
                          src={`http://localhost:8000/storage/${product.image || "placeholder.svg"}`}
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
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>Rp {rental.total.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {(rental.status === 0 || rental.status === 1) && (
                  <Button variant="destructive" className="w-full">
                    Cancel Rent
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Authenticated>
  );
}
