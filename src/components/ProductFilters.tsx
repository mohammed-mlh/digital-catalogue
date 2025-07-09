import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import React from "react"

interface ProductFiltersProps {
  onSearch: (value: string) => void
  onFilterChange: (filters: {
    category: string
    brand: string
    priceRange: string
  }) => void
  categories: string[]
  brands: string[]
  models: string[]
  filters: {
    category: string
    brand: string
    priceRange: string
  }
  searchQuery: string
}

export function ProductFilters({ onSearch, onFilterChange, categories, brands, models, filters, searchQuery }: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Keep local state in sync with props
  React.useEffect(() => {
    setLocalFilters(filters)
  }, [filters])
  React.useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium text-gray-700">
          Search Products
        </Label>
        <Input
          id="search"
          placeholder="Search by name, brand, or model..."
          value={localSearch}
          onChange={(e) => {
            setLocalSearch(e.target.value)
            onSearch(e.target.value)
          }}
          className="border-orange-200 focus:border-orange-300 focus:ring-orange-200"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Category</Label>
          <RadioGroup
            value={localFilters.category}
            onValueChange={(value) => handleFilterChange("category", value)}
            className="flex flex-wrap gap-3"
          >
            <div className="flex items-center">
              <RadioGroupItem value="all" id="category-all" className="peer sr-only" />
              <Label
                htmlFor="category-all"
                className="flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors border border-orange-200 hover:border-orange-300 peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
              >
                All
              </Label>
            </div>
            {categories.map((cat) => (
              <div className="flex items-center" key={cat}>
                <RadioGroupItem value={cat.toLowerCase()} id={`category-${cat.toLowerCase()}`} className="peer sr-only" />
                <Label
                  htmlFor={`category-${cat.toLowerCase()}`}
                  className="flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors border border-orange-200 hover:border-orange-300 peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
                >
                  {cat}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Brand</Label>
          <RadioGroup
            value={localFilters.brand}
            onValueChange={(value) => handleFilterChange("brand", value)}
            className="flex flex-wrap gap-3"
          >
            <div className="flex items-center">
              <RadioGroupItem value="all" id="brand-all" className="peer sr-only" />
              <Label
                htmlFor="brand-all"
                className="flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors border border-orange-200 hover:border-orange-300 peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
              >
                All
              </Label>
            </div>
            {brands.map((brand) => (
              <div className="flex items-center" key={brand}>
                <RadioGroupItem value={brand.toLowerCase()} id={`brand-${brand.toLowerCase()}`} className="peer sr-only" />
                <Label
                  htmlFor={`brand-${brand.toLowerCase()}`}
                  className="flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors border border-orange-200 hover:border-orange-300 peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Price Range</Label>
          <RadioGroup
            value={localFilters.priceRange}
            onValueChange={(value) => handleFilterChange("priceRange", value)}
            className="flex flex-wrap gap-3"
          >
            <div className="flex items-center">
              <RadioGroupItem value="all" id="price-all" className="peer sr-only" />
              <Label
                htmlFor="price-all"
                className="flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors border border-orange-200 hover:border-orange-300 peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
              >
                All
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="under-50" id="price-under-50" className="peer sr-only" />
              <Label
                htmlFor="price-under-50"
                className="flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors border border-orange-200 hover:border-orange-300 peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
              >
                Under $50
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="50-200" id="price-50-200" className="peer sr-only" />
              <Label
                htmlFor="price-50-200"
                className="flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors border border-orange-200 hover:border-orange-300 peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
              >
                $50 - $200
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="over-200" id="price-over-200" className="peer sr-only" />
              <Label
                htmlFor="price-over-200"
                className="flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors border border-orange-200 hover:border-orange-300 peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
              >
                Over $200
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
} 