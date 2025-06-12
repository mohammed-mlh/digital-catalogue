import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

interface ProductFiltersProps {
  onSearch: (value: string) => void
  onFilterChange: (filters: {
    category: string
    brand: string
    priceRange: string
  }) => void
}

export function ProductFilters({ onSearch, onFilterChange }: ProductFiltersProps) {
  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    priceRange: "all"
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
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
          onChange={(e) => onSearch(e.target.value)}
          className="border-orange-200 focus:border-orange-300 focus:ring-orange-200"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Category</Label>
          <RadioGroup
            value={filters.category}
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
            <div className="flex items-center">
              <RadioGroupItem value="engine" id="category-engine" className="peer sr-only" />
              <Label
                htmlFor="category-engine"
                className="flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors border border-orange-200 hover:border-orange-300 peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
              >
                Engine
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="brakes" id="category-brakes" className="peer sr-only" />
              <Label
                htmlFor="category-brakes"
                className="flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors border border-orange-200 hover:border-orange-300 peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
              >
                Brakes
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Brand</Label>
          <RadioGroup
            value={filters.brand}
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
            <div className="flex items-center">
              <RadioGroupItem value="ford" id="brand-ford" className="peer sr-only" />
              <Label
                htmlFor="brand-ford"
                className="flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors border border-orange-200 hover:border-orange-300 peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
              >
                Ford
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="toyota" id="brand-toyota" className="peer sr-only" />
              <Label
                htmlFor="brand-toyota"
                className="flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors border border-orange-200 hover:border-orange-300 peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
              >
                Toyota
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Price Range</Label>
          <RadioGroup
            value={filters.priceRange}
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