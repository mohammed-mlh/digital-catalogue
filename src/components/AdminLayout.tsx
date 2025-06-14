import { Outlet, Link } from "react-router-dom"
import { LayoutDashboard, Package } from "lucide-react"
import { Button } from "./ui/button"

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin</h1>
            <nav className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="ghost" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/admin/products">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Products
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-2 py-8">
        <Outlet />
      </main>
    </div>
  )
} 