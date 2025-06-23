import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export function SettingsPage() {
  const [whatsapp, setWhatsapp] = useState("")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      setError("")
      try {
        const settingsRef = doc(db, "settings", "main")
        const snap = await getDoc(settingsRef)
        if (snap.exists()) {
          setWhatsapp(snap.data().whatsapp || "")
        } else {
          // Create the doc if it doesn't exist
          await setDoc(settingsRef, { whatsapp: "" })
          setWhatsapp("")
        }
      } catch (err) {
        setError("Failed to load settings.")
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaved(false)
    try {
      const settingsRef = doc(db, "settings", "main")
      await setDoc(settingsRef, { whatsapp })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError("Failed to save settings.")
    }
  }

  return (
    <div className="max-w-xl w-full px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      {loading ? (
        <div className="text-gray-500 py-8">Loading...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Number
            </label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="e.g. +212600000000"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              className="rounded-lg border-gray-200 max-w-md"
              required
            />
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
            Save
          </Button>
          {saved && (
            <div className="text-green-600 font-medium">Saved!</div>
          )}
          {error && (
            <div className="text-red-600 font-medium">{error}</div>
          )}
        </form>
      )}
    </div>
  )
} 