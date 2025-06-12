import {
  Drawer,
  DrawerClose,
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
}

export function FilterDrawer({
  onSearch,
  onFilterChange,
}: FilterDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-black">Filters</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <ProductFilters
              onSearch={onSearch}
              onFilterChange={onFilterChange}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
} 