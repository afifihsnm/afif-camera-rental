"use client";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

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

interface RentalProduct {
  id: string;
  name: string;
  imageUrl: string;
  rate24Hour: number;
  rate12Hour?: number;
  quantity: number;
}

interface Rental {
  id: string;
  startDate: Date;
  endDate: Date;
  returnedDate?: Date;
  status: "Confirmed" | "Returned";
  products: RentalProduct[];
  subtotal: number;
  total: number;
  lateFee?: number;
}

// Example data based on the requirements
const rentals: Rental[] = [
  {
    id: "#101",
    startDate: new Date("2025-03-01T10:00:00"),
    endDate: new Date("2025-03-04T10:00:00"),
    status: "Confirmed",
    products: [
      {
        id: "canon-r5",
        name: "Canon EOS R5",
        imageUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-02-18%2012-35-47-2IVdKMvkqnXGRPIeFPEagQGZ31qOo5.png",
        rate24Hour: 25,
        rate12Hour: 15,
        quantity: 1
      },
      {
        id: "sony-a7iii",
        name: "Sony A7 III",
        imageUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-02-18%2012-35-47-2IVdKMvkqnXGRPIeFPEagQGZ31qOo5.png",
        rate24Hour: 20,
        quantity: 2
      }
    ],
    subtotal: 210,
    total: 210
  },
  {
    id: "#102",
    startDate: new Date("2025-02-15T09:00:00"),
    endDate: new Date("2025-02-18T09:00:00"),
    returnedDate: new Date("2025-02-18T15:00:00"),
    status: "Returned",
    products: [
      {
        id: "nikon-z7ii",
        name: "Nikon Z7 II",
        imageUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-02-18%2012-35-47-2IVdKMvkqnXGRPIeFPEagQGZ31qOo5.png",
        rate24Hour: 30,
        quantity: 1
      }
    ],
    subtotal: 90,
    total: 100,
    lateFee: 10
  }
];

const StatusBadge = ({ status }: { status: Rental["status"] }) => {
  const variants = {
    Confirmed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    Returned: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
  };

  return (
    <Badge variant="secondary" className={variants[status]}>
      {status}
    </Badge>
  );
};

export default function History() {
  return (
    <Authenticated>
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid gap-6 xl:grid-cols-2">
          {rentals.map((rental) => (
            <Card key={rental.id} className="flex flex-col overflow-hidden">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Rental ID: {rental.id}</div>
                  <StatusBadge status={rental.status} />
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(rental.startDate, "MMMM d, yyyy h:mm a")} -{" "}
                      {format(rental.endDate, "MMMM d, yyyy h:mm a")}
                    </span>
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
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          <div>24-Hour: ${product.rate24Hour}</div>
                          {product.rate12Hour && (
                            <div>12-Hour Fee: ${product.rate12Hour}</div>
                          )}
                          <div>Quantity: {product.quantity}</div>
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
                      <span>${rental.subtotal}</span>
                    </div>
                    {rental.lateFee && (
                      <div className="flex justify-between text-sm">
                        <span>Late Fee</span>
                        <span>${rental.lateFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${rental.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {rental.status === "Confirmed" && (
                  <Button variant="destructive" className="w-full">
                    Cancel Rent
                  </Button>
                )}
                {rental.status === "Returned" && (
                  <Button className="w-full">Pay Now</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Authenticated>
  );
}
