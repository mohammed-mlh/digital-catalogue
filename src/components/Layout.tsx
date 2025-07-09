import { Outlet, Link } from "react-router-dom"
import { Home, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { Button } from "./ui/button"

export function Layout() {
  const { totalItems } = useCart()

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="backdrop-blur bg-gradient-to-r from-orange-600 to-orange-700/90 text-white p-2 sm:p-4 shadow-lg sticky top-0 z-20 border-b border-orange-300/30">
        <div className="container mx-auto flex justify-between items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" aria-label="Home">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 focus:ring-2 focus:ring-white/50">
                <Home className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </Button>
            </Link>
          </div>
          <Link to="/" className="flex-1">
            <h1 className="text-lg sm:text-2xl font-extrabold text-white text-center tracking-tight drop-shadow cursor-pointer select-none">
              Catalog
            </h1>
          </Link>
          <Link to="/cart" aria-label="Cart">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 focus:ring-2 focus:ring-white/50">
              <ShoppingCart className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
              <span className="sr-only">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-10 max-w-6xl">
        <Outlet />
      </main>
    </div>
  )
} 