import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Calendar, X, Download, Filter } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

interface Order {
  id: string
  name: string
  phone: string
  address: string
  city: string
  items: Array<{
    productName: string
    quantity: number
    selectedOptions: Record<string, string>
    productPrice: string
  }>
  totalPrice?: number
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
    order.items.map(item => `${item.productName} x${item.quantity} (${item.productPrice})`).join(" | ")
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
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [itemsModalOrder, setItemsModalOrder] = useState<Order | null>(null)

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

  // Date and search filter logic
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
    // Search filter (name, phone, city)
    const search = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !search ||
      order.name.toLowerCase().includes(search) ||
      order.phone.toLowerCase().includes(search) ||
      order.city.toLowerCase().includes(search)
    return afterStart && beforeEnd && matchesSearch
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
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 border-gray-200 hover:bg-blue-50 text-blue-700 rounded-lg shadow-sm" onClick={() => setIsFilterOpen(true)}>
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="flex items-center gap-2 border-gray-200 hover:bg-blue-50 text-blue-700 rounded-lg shadow-sm"
          >
            <Download className="h-4 w-4" />

          </Button>
        </div>
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
                    <Button size="sm" variant="outline" onClick={() => setItemsModalOrder(order)}>
                      Show Items
                    </Button>
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

      {/* Filters Modal Trigger Button */}
      <div className="mb-8 flex justify-end">
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Orders</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              {/* Search Query Input */}
              <div className="flex flex-col">
                <label className="block text-xs font-medium text-gray-600 mb-1">Search (Name, Phone, City)</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, or city..."
                  className="rounded-lg border border-gray-200 px-4 py-2 w-full text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-150 hover:border-blue-300 outline-none bg-white shadow-sm"
                />
              </div>
              {/* Start Date */}
              <div className="flex flex-col">
                <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="rounded-lg border border-gray-200 px-4 py-2 w-full text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-400 pr-10 transition-all duration-150 hover:border-blue-300 outline-none bg-white shadow-sm"
                  />
                </div>
              </div>
              {/* End Date */}
              <div className="flex flex-col">
                <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="rounded-lg border border-gray-200 px-4 py-2 w-full text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-400 pr-10 transition-all duration-150 hover:border-blue-300 outline-none bg-white shadow-sm"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={clearDates} className="flex items-center gap-2 border-gray-200 hover:bg-gray-100 rounded-lg px-4 py-2 text-gray-700">
                Clear
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="default">Apply</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Items Modal */}
      <Dialog open={!!itemsModalOrder} onOpenChange={open => !open && setItemsModalOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Items</DialogTitle>
          </DialogHeader>
          {itemsModalOrder && (
            <div>
              {itemsModalOrder.items.map((item, idx) => (
                <div key={idx} className="mb-4 border-b pb-2">
                  <div className="font-medium">{item.productName} x{item.quantity} <span className="text-gray-500">({item.productPrice})</span></div>
                  {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                    <div className="text-xs text-gray-600 pl-2">
                      {Object.entries(item.selectedOptions).map(([key, value]) => (
                        <span key={key} className="mr-2">{key}: {value}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {itemsModalOrder.totalPrice !== undefined && (
                <div className="mt-2 font-bold text-orange-700">Total: {itemsModalOrder.totalPrice}</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 