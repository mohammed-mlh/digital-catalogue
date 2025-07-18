import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/contexts/CartContext"
import { ProductProvider } from "@/contexts/ProductContext"
import { Layout } from "@/components/Layout"
import { AdminLayout } from "@/components/AdminLayout"
import { HomePage } from "@/pages/HomePage"
import { CartPage } from "@/pages/CartPage"
import { CheckoutPage } from "@/pages/CheckoutPage"
import { DashboardPage } from "@/pages/admin/DashboardPage"
import { ProductsPage } from "@/pages/admin/ProductsPage"
import { SettingsPage } from "./pages/admin/SettingsPage"
import { OrdersPage } from "./pages/admin/OrdersPage"
import { OptionsPage } from "./pages/admin/OptionsPage"

function App() {
  return (
    <CartProvider>
      <ProductProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/products" element={<ProductsPage />} />
              <Route path="/admin/options" element={<OptionsPage />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </ProductProvider>
    </CartProvider>
  )
}

export default App
