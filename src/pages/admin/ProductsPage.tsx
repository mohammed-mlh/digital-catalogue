import { useState, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<Partial<ProductInput>>({
    name: "",
    brand: "",
    model: "",
    category: "",
    price: "",
    image: "",
    description: "",
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
    } catch (_err) {
      console.error(_err);
    }
  };

  const loadOptions = async () => {
    try {
      const data = await getAllOptions(); // assumed to return Option[]
      setAvailableOptions(data);
    } catch (_err) {
      console.error(_err);
    }
  };

  // Convert file to data URL
  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      model: "",
      category: "",
      price: "",
      image: "",
      description: "",
      optionIds: [],
    });
    setImageFile(null);
    setImagePreview("");
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image || "";

      // Convert image file to data URL if uploaded
      if (imageFile) {
        imageUrl = await convertFileToDataURL(imageFile);
      }

      const productData = {
        ...formData,
        image: imageUrl,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData as ProductInput);
        toast({ title: "Updated", description: "Product updated." });
      } else {
        await createProduct(productData as ProductInput);
        toast({ title: "Added", description: "Product created." });
      }
      setIsDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (_err) {
      toast({ title: "Error", description: "Could not save product.", variant: "destructive" });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setImagePreview(product.image);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  // Get unique brands, models, and categories for autocomplete
  const brandOptions = Array.from(new Set(products.map(p => p.brand).filter(Boolean))).map(b => ({ label: b, value: b }))
  const modelOptions = Array.from(new Set(products.map(p => p.model).filter(Boolean))).map(m => ({ label: m, value: m }))
  const categoryOptions = Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(c => ({ label: c, value: c }))

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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit" : "Add"} Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="brand">Brand</Label>
                  <CreatableSelect
                    inputId="brand"
                    options={brandOptions}
                    value={formData.brand ? { label: formData.brand, value: formData.brand } : null}
                    onChange={(option: any) => setFormData({ ...formData, brand: option ? option.value : "" })}
                    isClearable
                    isSearchable
                    placeholder=""
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="model">Model</Label>
                  <CreatableSelect
                    inputId="model"
                    options={modelOptions}
                    value={formData.model ? { label: formData.model, value: formData.model } : null}
                    onChange={(option: any) => setFormData({ ...formData, model: option ? option.value : "" })}
                    isClearable
                    isSearchable
                    placeholder=""
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="category">Category</Label>
                  <CreatableSelect
                    inputId="category"
                    options={categoryOptions}
                    value={formData.category ? { label: formData.category, value: formData.category } : null}
                    onChange={(option: any) => setFormData({ ...formData, category: option ? option.value : "" })}
                    isClearable
                    isSearchable
                    placeholder=""
                  />
                </div>
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
              <div className="space-y-1">
                <Label htmlFor="price">Price</Label>
                <Input id="price" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="image">Image</Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {(imagePreview || formData.image) && (
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
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
                      onClick={() => handleEditProduct(product)}
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
                        } catch (_err) {
                          console.error(_err);
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
