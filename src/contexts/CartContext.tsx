import { createContext, useContext, useState } from "react"
import { Product } from "@/types/product"

interface CartItem extends Product {
  quantity: number
  selectedOptions?: Record<string, string>
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number, selectedOptions?: Record<string, string>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (product: Product, quantity: number = 1, selectedOptions?: Record<string, string>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevItems, { ...product, quantity, selectedOptions, price: product.price.toString() }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => {
    const price = parseFloat(item.price.replace("$", ""))
    return total + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
} 