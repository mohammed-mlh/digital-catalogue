import { Button } from "./ui/button"
import { Eye } from "lucide-react"
import { useState } from "react"
import { ProductDrawer } from "./ProductDrawer"
import { ProductWithOptions } from "@/types/product"

export function ProductCard(product: ProductWithOptions) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleCardClick = () => {
    setIsDrawerOpen(true)
  }

  const handleEyeButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking the eye button
    setIsDrawerOpen(true)
  }

  return (
    <>
      <div 
        className="bg-white rounded-xl border border-orange-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.025] transition-all duration-200 cursor-pointer group overflow-hidden"
        onClick={handleCardClick}
      >
        <div className="relative aspect-[4/3] bg-orange-50 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <Button
            onClick={handleEyeButtonClick}
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow"
          >
            <Eye className="h-4 w-4 text-orange-600" />
          </Button>
          <span className="absolute left-2 top-2 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded shadow-sm">
            {product.brand}
          </span>
        </div>
        <div className="p-4 flex flex-col gap-1">
          <h3 className="text-base font-bold text-gray-900 truncate leading-tight">
            {product.name}
          </h3>
          <span className="text-xs text-gray-500 font-medium truncate">{product.model}</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg text-orange-600 font-extrabold">${product.price}</span>
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