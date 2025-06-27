import { useState, useEffect } from "react";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Product, ProductInput } from "@/types/product";
import { Option } from "@/types/option";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/models/products";
import { getAllOptions } from "@/models/options"; // you must implement this

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [availableOptions, setAvailableOptions] = useState<Option[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<ProductInput>>({
    name: "",
    brand: "",
    model: "",
    category: "",
    price: "",
    image: "",
    description: "",
    rating: 0,
    reviews: 0,
    optionIds: [],
  });

  useEffect(() => {
    loadProducts();
    loadOptions();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOptions = async () => {
    try {
      const data = await getAllOptions(); // assumed to return Option[]
      setAvailableOptions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData as ProductInput);
        toast({ title: "Updated", description: "Product updated." });
      } else {
        await createProduct(formData as ProductInput);
        toast({ title: "Added", description: "Product created." });
      }
      setIsDialogOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      toast({ title: "Error", description: "Could not save product.", variant: "destructive" });
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
      <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 hidden md:block">Manage products</p>
          </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4" /></Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit" : "Add"} Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={formData.brand || ""} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="model">Model</Label>
                <Input id="model" value={formData.model || ""} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
              </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={formData.category || ""} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
              </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="price">Price</Label>
                <Input id="price" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" value={formData.image || ""} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="options">Options</Label>
                <Select
                  isMulti
                  inputId="options"
                  options={availableOptions.map(opt => ({ label: opt.name, value: opt.id }))}
                  value={availableOptions
                    .filter(opt => formData.optionIds?.includes(opt.id))
                    .map(opt => ({ label: opt.name, value: opt.id }))}
                  onChange={selected => setFormData({
                    ...formData,
                    optionIds: selected.map((item) => item.value),
                  })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingProduct ? "Update" : "Create"}</Button>
              </div>
            </form>

          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand/Model</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.brand} / {product.model}</TableCell>
                <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingProduct(product);
                        setFormData({ ...product });
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        const confirmed = window.confirm(`Are you sure you want to delete "${product.name}"?`);
                        if (!confirmed) return;

                        try {
                          await deleteProduct(product.id);
                          loadProducts();
                          toast({ title: "Deleted", description: "Product deleted successfully." });
                        } catch (err) {
                          toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
