import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/Components/ui/carousel";
import { Separator } from "@/Components/ui/separator";
import AuthenticatedLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { Link, router } from "@inertiajs/react";
import { Camera, ChevronLeft, Clock, DollarSign, Package } from "lucide-react";
import { useState } from "react";

type ProductDetail = {
  id: number;
  title: string;
  description: string;
  images: string[];
  rate_12h: number;
  rate_24h: number;
  late_fee: number;
  stock: number;
  category: string;
  brand: string;
};

interface DetailProps extends PageProps {
  detail: ProductDetail;
}

export default function Detail({ detail }: DetailProps) {
  const [data] = useState({
    product_id: detail.id
  });

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    router.post("/cart/add", data);
  }

  return (
    <AuthenticatedLayout>
      <Link href="/search">
        <Button variant="outline" className="ml-4 mt-8 pl-2 xl:ml-40">
          <ChevronLeft /> Back
        </Button>
      </Link>
      <div className="container mx-auto min-h-screen px-4 pb-8 pt-4">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Image Gallery */}
          <Carousel className="mx-auto w-full max-w-xs md:max-w-md">
            <CarouselContent>
              {detail.images.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <img
                          src={`http://localhost:8000/storage/${src || "placeholder.svg"}`}
                          alt={`${detail.title} - Image ${index + 1}`}
                          width={400}
                          height={400}
                          className="rounded-lg object-cover"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{detail.title}</h1>
              <div className="mt-2 flex items-center space-x-2">
                <Badge variant="secondary">{detail.category}</Badge>
                <Badge variant="outline">{detail.brand}</Badge>
              </div>
            </div>

            <p className="text-muted-foreground">{detail.description}</p>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Rental Rates</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {detail.rate_12h && (
                  <Card>
                    <CardContent className="flex items-center p-4">
                      <Clock className="mr-4 h-8 w-8" />
                      <div>
                        <p className="text-sm font-medium">12-Hour Rental</p>
                        <p className="text-2xl font-bold">
                          Rp {detail.rate_12h.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card>
                  <CardContent className="flex items-center p-4">
                    <Clock className="mr-4 h-8 w-8" />
                    <div>
                      <p className="text-sm font-medium">24-Hour Rental</p>
                      <p className="text-2xl font-bold">
                        Rp {detail.rate_24h.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <p>
                  Late Fee:{" "}
                  <span className="font-semibold">
                    Rp {detail.late_fee.toLocaleString("id-ID")}/hr
                  </span>
                </p>
              </div>
              <div className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                <p>
                  Stock Available:{" "}
                  <span className="font-semibold">
                    {detail.stock.toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <Button type="submit" size="lg" className="w-full">
                <Camera className="h-4 w-4" /> Add to Cart
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
