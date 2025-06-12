import { Outlet, Link } from "react-router-dom"
import { Home, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { Button } from "./ui/button"

export function Layout() {
  const { totalItems } = useCart()

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Home className="h-8 w-8" />
              </Button>
            </Link>
          </div>
            <h1 className="block text-xl font-bold text-white text-center">Catalog</h1>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
              <ShoppingCart className="h-8 w-8" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <Outlet />
      </main>
    </div>
  )
} 