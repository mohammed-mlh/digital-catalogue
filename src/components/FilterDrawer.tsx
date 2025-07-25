import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ProductFilters } from "./ProductFilters"
import { SlidersHorizontal } from "lucide-react"

interface FilterDrawerProps {
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

export function FilterDrawer({
  onSearch,
  onFilterChange,
  categories,
  brands,
  models,
  filters,
  searchQuery,
}: FilterDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default" className="w-full sm:w-auto">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="">
          <DrawerHeader>
            <DrawerTitle className="text-black">Filters</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <ProductFilters
              onSearch={onSearch}
              onFilterChange={onFilterChange}
              categories={categories}
              brands={brands}
              models={models}
              filters={filters}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
} 