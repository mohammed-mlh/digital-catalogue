import { Button } from "./ui/button"
import { Eye } from "lucide-react"
import { useState } from "react"
import { ProductDrawer } from "./ProductDrawer"
import { Product } from "@/types/product"

interface ProductCardProps extends Product {}

export function ProductCard(product: ProductCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover"
          />
          <Button
            onClick={() => setIsDrawerOpen(true)}
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-800 truncate">{product.name}</h3>
          <p className="text-[10px] text-gray-600 mt-1">{product.brand} {product.model}</p>
          <div className="mt-2">
            <span className="text-sm text-orange-600 font-bold">{product.price}</span>
          </div>
        </div>
      </div>

      <ProductDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={product}
      />
    </>
  )
} 