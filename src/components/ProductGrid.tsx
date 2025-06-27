import { useEffect, useState } from "react"
import { ProductCard } from "./ProductCard"
import { FilterDrawer } from "./FilterDrawer"
import { getProductsWithOptions } from "@/models/products"
import { ProductWithOptions } from "@/types/product"

export function ProductGrid() {
  const [products, setProducts] = useState<ProductWithOptions[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    category: "all",
    brand: "all",
    priceRange: "all"
  })

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError("")
      try {
        const prds = await getProductsWithOptions();
        setProducts(prds)
      } catch (err) {
        setError("Failed to load products.")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

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
            onSearch={setSearchQuery}
            onFilterChange={setActiveFilters}
          />
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
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