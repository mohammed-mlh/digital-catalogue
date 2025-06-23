import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Calendar, X, Download } from "lucide-react"

interface Order {
  id: string
  name: string
  phone: string
  address: string
  city: string
  items: Array<{ name: string; quantity: number }>
  createdAt?: { seconds: number }
}

function ordersToCSV(orders: Order[]) {
  const header = ["Date", "Name", "Phone", "City", "Address", "Items"]
  const rows = orders.map(order => [
    order.createdAt?.seconds
      ? new Date(order.createdAt.seconds * 1000).toLocaleString()
      : "-",
    order.name,
    order.phone,
    order.city,
    order.address,
    order.items.map(item => `${item.name} x${item.quantity}`).join(" | ")
  ])
  const csv = [header, ...rows]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
    .join("\n")
  return csv
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError("")
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
        const snap = await getDocs(q)
        setOrders(
          snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]
        )
      } catch (err) {
        setError("Failed to load orders.")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // Date filter logic
  const filteredOrders = orders.filter(order => {
    if (!order.createdAt?.seconds) return false
    const orderDate = new Date(order.createdAt.seconds * 1000)
    let afterStart = true
    let beforeEnd = true
    if (startDate) {
      afterStart = orderDate >= new Date(startDate + "T00:00:00")
    }
    if (endDate) {
      beforeEnd = orderDate <= new Date(endDate + "T23:59:59")
    }
    return afterStart && beforeEnd
  })

  const clearDates = () => {
    setStartDate("")
    setEndDate("")
  }

  const handleExportCSV = () => {
    const csv = ordersToCSV(filteredOrders)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `orders-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto px-2 py-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {/* Beautiful Date Filters UI */}
      <div className="mb-8">
        <div className="bg-gradient-to-tr from-white via-gray-50 to-blue-50 rounded-2xl shadow-lg px-8 py-6 flex flex-col md:flex-row md:items-center gap-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2 md:mb-0">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-lg font-semibold text-gray-800">Filter by Date</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex flex-col flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="rounded-lg border border-gray-200 px-4 py-2 w-full text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-400 pr-10 transition-all duration-150 hover:border-blue-300 outline-none bg-white shadow-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 h-4 w-4 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="rounded-lg border border-gray-200 px-4 py-2 w-full text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-400 pr-10 transition-all duration-150 hover:border-blue-300 outline-none bg-white shadow-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 h-4 w-4 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <label className="block text-xs font-medium text-transparent mb-1">Clear</label>
              <Button
                type="button"
                variant="outline"
                onClick={clearDates}
                className="flex items-center gap-2 border-gray-200 hover:bg-gray-100 rounded-lg px-4 py-2 text-gray-700"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600 md:ml-auto whitespace-nowrap mt-4 md:mt-0">
            Showing <span className="font-semibold text-blue-700">{filteredOrders.length}</span> of {orders.length} orders
          </div>
        </div>
      </div>
      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="flex items-center gap-2 border-gray-200 hover:bg-blue-50 text-blue-700 rounded-lg shadow-sm"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No orders found for the selected date range.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">City</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Address</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Items</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.createdAt?.seconds
                      ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.name}</td>
                  <td className="px-4 py-3 text-sm">{order.phone}</td>
                  <td className="px-4 py-3 text-sm">{order.city}</td>
                  <td className="px-4 py-3 text-sm">{order.address}</td>
                  <td className="px-4 py-3 text-sm">
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.name} x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {/* Placeholder for future View button */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
} 