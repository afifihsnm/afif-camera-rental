export type Category = {
  id: number;
  name: string;
};

export type Brand = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  title: string;
  image: string;
  price: number;
  stock: number;
  slug: string;
  category: string;
  brand: string;
};

export function filterProducts(
  products: Product[],
  filters: {
    brand: string[];
    category: string[];
    priceRange: { min: number; max: number };
  }
): Product[] {
  return products.filter((product) => {
    const brandMatch =
      filters.brand.length === 0 || filters.brand.includes(product.brand);
    const categoryMatch =
      filters.category.length === 0 ||
      filters.category.includes(product.category);
    const priceMatch =
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max;
    return brandMatch && categoryMatch && priceMatch;
  });
}

export function sortProducts(
  products: Product[],
  sortOption: string
): Product[] {
  const sortedProducts = [...products];
  switch (sortOption) {
    case "priceLowToHigh":
      return sortedProducts.sort((a, b) => a.price - b.price);
    case "priceHighToLow":
      return sortedProducts.sort((a, b) => b.price - a.price);
    case "newest":
      return sortedProducts.sort((a, b) => b.id - a.id);
    default: // popularity
      return sortedProducts;
  }
}
