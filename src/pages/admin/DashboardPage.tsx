import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProducts } from "@/models/products"
import { useEffect, useState } from "react"
import { Package, Tag, DollarSign, Star, TrendingUp, Users } from "lucide-react"

interface DashboardStats {
  totalProducts: number
  totalCategories: number
  averagePrice: number
  totalReviews: number
  topRatedProducts: number
  totalBrands: number
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    averagePrice: 0,
    totalReviews: 0,
    topRatedProducts: 0,
    totalBrands: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const products = await getProducts()
      
      const categories = new Set(products.map(p => p.category))
      const brands = new Set(products.map(p => p.brand))
      const totalPrice = products.reduce((sum, p) => sum + parseFloat(p.price.replace("$", "")), 0)
      const totalReviews = products.reduce((sum, p) => sum + p.reviews, 0)
      const topRated = products.filter(p => p.rating >= 4.5).length

      setStats({
        totalProducts: products.length,
        totalCategories: categories.size,
        averagePrice: products.length > 0 ? totalPrice / products.length : 0,
        totalReviews,
        topRatedProducts: topRated,
        totalBrands: brands.size
      })
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Tag,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Average Price",
      value: `$${stats.averagePrice.toFixed(2)}`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your product catalog</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 