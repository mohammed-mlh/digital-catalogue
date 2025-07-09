import { useEffect, useState } from "react"
import { ProductCard } from "./ProductCard"
import { FilterDrawer } from "./FilterDrawer"
import { getProductsWithOptions } from "@/models/products"
import { ProductWithOptions } from "@/types/product"
import Loader from "@/components/ui/Loader"
import { useSearchParams } from "react-router-dom"

export function ProductGrid() {
  const [products, setProducts] = useState<ProductWithOptions[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from search params
  const initialFilters = {
    category: searchParams.get("category") || "all",
    brand: searchParams.get("brand") || "all",
    priceRange: searchParams.get("priceRange") || "all"
  };
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeFilters, setActiveFilters] = useState(initialFilters);

  // Update search params when filters or search change
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setSearchParams({
      ...activeFilters,
      q: value
    });
  };

  const handleFilterChange = (filters: typeof activeFilters) => {
    setActiveFilters(filters);
    setSearchParams({
      ...filters,
      q: searchQuery
    });
  };

  // Keep UI in sync with URL (when user navigates back/forward)
  useEffect(() => {
    setActiveFilters({
      category: searchParams.get("category") || "all",
      brand: searchParams.get("brand") || "all",
      priceRange: searchParams.get("priceRange") || "all"
    });
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError("")
      try {
        const prds = await getProductsWithOptions();
        setProducts(prds)
      } catch (_err) {
        setError("Failed to load products.")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Extract unique categories, brands, and models
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean)
  const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean)
  const models = Array.from(new Set(products.map(p => p.model))).filter(Boolean)

  const filteredProducts = products.filter(product => {
    // Search filter
    const searchMatch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.model.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const categoryMatch = 
      activeFilters.category === "all" || 
      product.category.toLowerCase() === activeFilters.category

    // Brand filter
    const brandMatch = 
      activeFilters.brand === "all" || 
      product.brand.toLowerCase() === activeFilters.brand

    // Price range filter
    const price = parseFloat(product.price.replace("$", ""))
    let priceMatch = true
    if (activeFilters.priceRange === "under-50") {
      priceMatch = price < 50
    } else if (activeFilters.priceRange === "50-200") {
      priceMatch = price >= 50 && price <= 200
    } else if (activeFilters.priceRange === "over-200") {
      priceMatch = price > 200
    }

    return searchMatch && categoryMatch && brandMatch && priceMatch
  })

  return (
    <div className="min-h-screen">
      <div className="p-2">
        <div className="mb-4">
          <FilterDrawer
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            categories={categories}
            brands={brands}
            models={models}
            filters={activeFilters}
            searchQuery={searchQuery}
          />
        </div>
        {loading ? (
          <Loader className="py-12" />
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 