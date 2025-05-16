import { SearchFilter } from "@/Components/Product/SearchFilter";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/Components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/Components/ui/sheet";
import AuthenticatedLayout from "@/Layouts/AppLayout";
import {
  Brand,
  Category,
  filterProducts,
  sortProducts,
  type Product
} from "@/lib/data";
import { PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { FilterIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Filters = {
  brand: string[];
  category: string[];
  priceRange: { min: number; max: number };
};

interface SearchProps extends PageProps {
  allProducts: Product[];
  brands: Brand[];
  categories: Category[];
}

export default function Search({
  categories,
  brands,
  allProducts
}: SearchProps) {
  const { appUrl } = usePage().props;

  const [filters, setFilters] = useState<Filters>({
    brand: [],
    category: [],
    priceRange: { min: 0, max: 100000000 }
  });
  const [sortOption, setSortOption] = useState("latest");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const filtered = filterProducts(allProducts, filters);
    const sorted = sortProducts(filtered, sortOption);
    setProducts(sorted);
  }, [allProducts, filters, sortOption]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setProducts(
      sortProducts(filterProducts(allProducts, newFilters), sortOption)
    );
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setProducts(sortProducts(filterProducts(allProducts, filters), option));
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto max-w-screen-2xl px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="mb-4 text-3xl font-bold sm:mb-0">Browse Products</h1>
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <FilterIcon className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                  <SheetDescription>
                    Adjust your product filters here.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <SearchFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    brandOptions={brands.map((brand) => brand.name)}
                    categoryOptions={categories.map(
                      (category) => category.name
                    )}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-4">
          <Card className="hidden h-fit lg:block">
            <CardContent className="p-6">
              <SearchFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                brandOptions={brands.map((brand) => brand.name)}
                categoryOptions={categories.map((category) => category.name)}
              />
            </CardContent>
          </Card>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Link href={`/product/${product.slug}`} key={product.id}>
                  <Card>
                    <CardContent className="p-4">
                      <img
                        src={`${appUrl}/storage/${product.image || "placeholder.svg"}`}
                        alt={product.title}
                        width={300}
                        height={300}
                        className="mb-4 rounded-lg object-cover"
                      />
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>
                        <p className="font-semibold">{product.brand}</p>
                        <h3 className="font-bold">{product.title}</h3>
                        <p className="text-sm text-gray-500">
                          Stock: {product.stock}
                        </p>
                        <p className="text-lg font-bold">
                          Rp {product.price.toLocaleString("id-ID")}/day
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
