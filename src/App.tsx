import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { CartProvider } from "@/contexts/CartContext"
import { ProductProvider } from "@/contexts/ProductContext"
import { Layout } from "@/components/Layout"
import { HomePage } from "@/pages/HomePage"
import { CartPage } from "@/pages/CartPage"
import { CheckoutPage } from "@/pages/CheckoutPage"
import { DashboardPage } from "@/pages/admin/DashboardPage"
import { ProductsPage } from "@/pages/admin/ProductsPage"

function App() {
  const { toast } = useToast()

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
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/products" element={<ProductsPage />} />
          </Routes>
          <Toaster />
        </Router>
      </ProductProvider>
    </CartProvider>
  )
}

export default App
