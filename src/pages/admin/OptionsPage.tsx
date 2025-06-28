import { useEffect, useState } from "react"
import { Option, OptionInput } from "@/types/option"
import { getAllOptions, createOption, updateOption, deleteOption } from "@/models/options"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Plus, Pencil, Trash2, X } from "lucide-react"

export function OptionsPage() {
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOption, setEditingOption] = useState<Option | null>(null)
  const [formData, setFormData] = useState<Partial<OptionInput>>({ name: '', values: [''] })

  const loadOptions = async () => {
    setLoading(true)
    try {
      const data = await getAllOptions()
      setOptions(data)
    } catch (_error) {
      console.error("Failed to load options:", _error)
      toast({ title: "Error", description: "Failed to load options", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOptions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const optionData: OptionInput = {
        name: formData.name || '',
        values: formData.values || [],
      }

      if (editingOption) {
        await updateOption(editingOption.id, optionData)
        toast({ title: "Success", description: "Option updated" })
      } else {
        await createOption(optionData)
        toast({ title: "Success", description: "Option added" })
      }

      setFormData({ name: '', values: [''] })
      setEditingOption(null)
      setIsDialogOpen(false)
      loadOptions()
    } catch (error) {
      toast({ title: "Error", description: "Failed to save option", variant: "destructive" })
    }
  }

  const handleEdit = (option: Option) => {
    setEditingOption(option)
    setFormData({ name: option.name, values: [...option.values] })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this option?")) return
    try {
      await deleteOption(id)
      toast({ title: "Success", description: "Option deleted" })
      loadOptions()
    } catch {
      toast({ title: "Error", description: "Failed to delete option", variant: "destructive" })
    }
  }

  return (
    <div className="">
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Options</h1>
            <p className="text-gray-500">Manage reusable product options</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editingOption ? "Edit Option" : "New Option"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Option Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Values *</Label>
                  <div className="space-y-2">
                    {formData.values?.map((value, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={value}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              values: prev.values?.map((v, i) => i === index ? e.target.value : v) || []
                            }))
                          }
                          placeholder="e.g., Red, Large, Leather"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            setFormData(prev => ({
                              ...prev,
                              values: prev.values?.filter((_, i) => i !== index) || []
                            }))
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          values: [...(prev.values || []), '']
                        }))
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Value
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                    {editingOption ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white/90 rounded-2xl shadow-lg border border-gray-100 overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white/95 z-10 shadow-sm">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Values</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-400 text-lg">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : options.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-400 text-lg">
                    No options available.
                  </TableCell>
                </TableRow>
              ) : (
                options.map((option) => (
                  <TableRow key={option.id} className="hover:bg-blue-50/40 transition-colors">
                    <TableCell className="font-medium text-gray-900">{option.name}</TableCell>
                    <TableCell className="text-gray-600">
                      {option.values.join(", ")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(option)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(option.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
