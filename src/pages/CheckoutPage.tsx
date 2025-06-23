import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { useState, useRef } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, Timestamp, doc, getDoc } from "firebase/firestore"

export function CheckoutPage() {
  const { items, clearCart } = useCart()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)
  const cityRef = useRef<HTMLInputElement>(null)

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some items to your cart before checking out</p>
        <Button onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError("")
    try {
      // Get form values
      const name = nameRef.current?.value || ""
      const phone = phoneRef.current?.value || ""
      const address = addressRef.current?.value || ""
      const city = cityRef.current?.value || ""

      // Save order to Firestore
      const orderData = {
        name,
        phone,
        address,
        city,
        items,
        createdAt: Timestamp.now(),
      }
      await addDoc(collection(db, "orders"), orderData)

      // Fetch WhatsApp number from settings
      const settingsSnap = await getDoc(doc(db, "settings", "main"))
      let whatsapp = ""
      if (settingsSnap.exists()) {
        whatsapp = settingsSnap.data().whatsapp || ""
      }
      if (!whatsapp) throw new Error("WhatsApp number not set in settings.")

      // Compose WhatsApp message
      const itemLines = items.map(
        (item, idx) =>
          `${idx + 1}. ${item.name} (${item.brand} ${item.model}) x${item.quantity} - ${item.price} DHs`
      ).join("%0A")
      const message =
        `Bonjour, je souhaite commander :%0A` +
        itemLines +
        `%0A---%0A` +
        `Nom: ${name}%0A` +
        `Téléphone: ${phone}%0A` +
        `Adresse: ${address}%0A` +
        `Ville: ${city}`

      // Clear cart and redirect to WhatsApp
      clearCart()
      window.location.href = `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}?text=${message}`
    } catch (err: any) {
      setError(err.message || "An error occurred during checkout.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-center">Checkout</h2>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Contact Information</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required ref={nameRef} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" required ref={phoneRef} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Shipping Address</h3>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" required ref={addressRef} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" required ref={cityRef} />
            </div>
          </div>

          {error && <div className="text-red-600 text-center font-medium">{error}</div>}

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Place Order"}
          </Button>
        </form>
      </div>
    </div>
  )
}