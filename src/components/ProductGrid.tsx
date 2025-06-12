import { products } from "@/data/products"
import { ProductCard } from "./ProductCard"
import { FilterDrawer } from "./FilterDrawer"
import { useState } from "react"
import { Product } from "@/types/product"

export function ProductGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    category: "all",
    brand: "all",
    priceRange: "all"
  })

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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 