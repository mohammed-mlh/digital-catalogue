import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/CartContext"
import { ShoppingCart } from "lucide-react"
import { ProductWithOptions } from "@/types/product"

interface ProductDrawerProps {
  isOpen: boolean
  onClose: () => void
  product: ProductWithOptions
}

export function ProductDrawer({ isOpen, onClose, product }: ProductDrawerProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  console.log(product);
  

  // console.log(product)
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }))

  }

  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value) || 1
    setQuantity(Math.max(1, numValue))
  }

  const handleAddToCart = () => {
    // Convert ProductWithOptions to Product by omitting 'options' and adding optionIds: []
    const { options, ...rest } = product;
    const productWithoutOptions = { ...rest, optionIds: [] };
    addToCart(productWithoutOptions, quantity, selectedOptions)
    onClose()
    // Reset quantity when drawer closes
    setQuantity(1)
  }

  const areAllOptionsSelected = product.options.every(
    option => selectedOptions[option.name]
  )

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] flex flex-col">
        <DrawerHeader className="bg-white flex-none border-b">
          <DrawerTitle className="text-black">{product.name}</DrawerTitle>
          <DrawerDescription className="text-gray-600">
            {product.brand} {product.model}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg shadow-sm"
          />
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border">
              <span className="text-sm text-gray-600">Price</span>
              <span className="text-lg font-bold text-black">
                {product.price}
              </span>
            </div>
            
            <div className="space-y-2 bg-white p-3 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-700">{product.description}</p>
            </div>

            {/* Quantity Selection */}
            <div className="space-y-2 bg-white p-3 rounded-lg shadow-sm border">
              <Label className="text-sm text-gray-700">Quantity</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="w-24"
              />
            </div>

            {product.options.length > 0 && (
              <div className="space-y-4 bg-white p-3 rounded-lg shadow-sm border">
                <h4 className="font-medium text-black">Options</h4>
                {product.options.map((option) => (
                  <div key={option.name} className="space-y-3">
                    <Label className="text-sm text-gray-700 capitalize">
                      {option.name}
                    </Label>
                    <RadioGroup
                      value={selectedOptions[option.name]}
                      onValueChange={(value: string) => handleOptionChange(option.name, value)}
                      className="flex flex-wrap gap-3"
                    >
                      {option.values.map((opt) => (
                        <div key={opt} className="flex items-center">
                          <RadioGroupItem
                            value={opt}
                            id={`${option.name}-${opt}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`${option.name}-${opt}`}
                            className={cn(
                              "flex items-center justify-center px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors",
                              "border border-gray-200 hover:border-gray-300",
                              "peer-data-[state=checked]:bg-orange-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-700"
                            )}
                          >
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DrawerFooter className="bg-white flex-none border-t">
          <div className="flex gap-4">
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">
                Close
              </Button>
            </DrawerClose>
            <Button 
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!areAllOptionsSelected}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart ({quantity})
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
} 