import { Outlet, Link } from "react-router-dom"
import { LayoutDashboard, Package, Settings, ShoppingCart, Menu, List } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

export function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Admin</h1>
              <button
                className="sm:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-label="Toggle navigation"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <nav
              className={`flex-col sm:flex-row flex gap-2 sm:gap-4 ${mobileNavOpen ? 'flex' : 'hidden'} sm:flex`}
            >
              <Link to="/admin">
                <Button variant="ghost" className="flex items-center gap-2 w-full sm:w-auto justify-start">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/admin/products">
                <Button variant="ghost" className="flex items-center gap-2 w-full sm:w-auto justify-start">
                  <Package className="h-4 w-4" />
                  Products
                </Button>
              </Link>
              <Link to="/admin/options">
                <Button variant="ghost" className="flex items-center gap-2 w-full sm:w-auto justify-start">
                  <List className="h-4 w-4" />
                  Options
                </Button>
              </Link>
              <Link to="/admin/orders">
                <Button variant="ghost" className="flex items-center gap-2 w-full sm:w-auto justify-start">
                  <ShoppingCart className="h-4 w-4" />
                  Orders
                </Button>
              </Link>
              <Link to="/admin/settings">
                <Button variant="ghost" className="flex items-center gap-2 w-full sm:w-auto justify-start">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="lg:container lg:mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}