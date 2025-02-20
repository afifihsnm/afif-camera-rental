import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { useEffect, useState } from "react";

type SearchFilterProps = {
  filters: {
    brand: string[];
    category: string[];
    priceRange: { min: number; max: number };
  };
  onFilterChange: (filters: SearchFilterProps["filters"]) => void;
  brandOptions: string[];
  categoryOptions: string[];
};

export function SearchFilter({
  filters,
  onFilterChange,
  brandOptions,
  categoryOptions
}: SearchFilterProps) {
  const [minPrice, setMinPrice] = useState(filters.priceRange.min.toString());
  const [maxPrice, setMaxPrice] = useState(filters.priceRange.max.toString());

  useEffect(() => {
    setMinPrice(filters.priceRange.min.toString());
    setMaxPrice(filters.priceRange.max.toString());
  }, [filters.priceRange]);

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brand.includes(brand)
      ? filters.brand.filter((b) => b !== brand)
      : [...filters.brand, brand];
    onFilterChange({ ...filters, brand: newBrands });
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter((c) => c !== category)
      : [...filters.category, category];
    onFilterChange({ ...filters, category: newCategories });
  };

  const handleMinPriceChange = (value: string) => {
    const newMin = Math.max(
      0,
      Math.min(Number.parseInt(value) || 0, Number.parseInt(maxPrice) - 1)
    );
    setMinPrice(newMin.toString());
    onFilterChange({
      ...filters,
      priceRange: { min: newMin, max: Number.parseInt(maxPrice) }
    });
  };

  const handleMaxPriceChange = (value: string) => {
    const newMax = Math.max(
      Number.parseInt(minPrice) + 1,
      Number.parseInt(value) || 0
    );
    setMaxPrice(newMax.toString());
    onFilterChange({
      ...filters,
      priceRange: { min: Number.parseInt(minPrice), max: newMax }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Filters</h1>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Brand</h3>
        {brandOptions.map((brand) => (
          <div key={brand} className="flex items-center space-x-2">
            <Checkbox
              id={`brand-${brand}`}
              checked={filters.brand.includes(brand)}
              onCheckedChange={() => handleBrandChange(brand)}
            />
            <label htmlFor={`brand-${brand}`}>{brand}</label>
          </div>
        ))}
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Category</h3>
        {categoryOptions.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox
              id={`category-${category}`}
              checked={filters.category.includes(category)}
              onCheckedChange={() => handleCategoryChange(category)}
            />
            <label htmlFor={`category-${category}`}>{category}</label>
          </div>
        ))}
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Price Range</h3>
        <div className="space-y-2">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-8">Min:</span>
              <Input
                id="min-price"
                type="number"
                min={0}
                max={Number.parseInt(maxPrice) - 1}
                value={minPrice}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-8">Max:</span>
              <Input
                id="max-price"
                type="number"
                min={Number.parseInt(minPrice) + 1}
                max={1000}
                value={maxPrice}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
