import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/models/products"
import { Plus, Pencil, Trash2, Search, Filter, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Product, ProductInput } from "@/types/product"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<ProductInput>>({
    name: '',
    brand: '',
    model: '',
    category: '',
    price: '',
    description: '',
    image: '',
    rating: 0,
    reviews: 0,
    options: [],
  })
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, searchTerm, categoryFilter, brandFilter, priceRange])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    // Brand filter
    if (brandFilter !== "all") {
      filtered = filtered.filter(product => product.brand.toLowerCase().includes(brandFilter.toLowerCase()))
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price.replace("$", ""))
        switch (priceRange) {
          case "0-100":
            return price <= 100
          case "100-500":
            return price > 100 && price <= 500
          case "500-1000":
            return price > 500 && price <= 1000
          case "1000+":
            return price > 1000
          default:
            return true
        }
      })
    }

    setFilteredProducts(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setBrandFilter("all")
    setPriceRange("all")
  }

  const getUniqueBrands = () => {
    const brands = [...new Set(products.map(product => product.brand))]
    return brands.sort()
  }

  const getUniqueCategories = () => {
    const categories = [...new Set(products.map(product => product.category))]
    return categories.sort()
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      brand: product.brand,
      model: product.model,
      category: product.category,
      price: product.price,
      description: product.description,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
      options: product.options,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id)
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
        loadProducts()
      } catch (error) {
        console.error("Error deleting product:", error)
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        })
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const productData: ProductInput = {
        name: formData.name || '',
        brand: formData.brand || '',
        model: formData.model || '',
        category: formData.category || '',
        price: formData.price || '',
        description: formData.description || '',
        image: formData.image || '',
        rating: formData.rating || 0,
        reviews: formData.reviews || 0,
        options: formData.options || [],
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      } else {
        await createProduct(productData)
        toast({
          title: "Success",
          description: "Product added successfully",
        })
      }

      setIsDialogOpen(false)
      setEditingProduct(null)
      setFormData({
        name: '',
        brand: '',
        model: '',
        category: '',
        price: '',
        description: '',
        image: '',
        rating: 0,
        reviews: 0,
        options: [],
      })
      loadProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen py-8 px-2 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Products</h1>
            <p className="text-gray-500 text-base">Manage your product catalog</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg border-gray-200 hover:bg-gray-100"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md rounded-lg px-5 py-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
            <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                      <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                      <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  required
                />
              </div>
              <div>
                      <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                        onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  required
                />
              </div>
              <div>
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="reviews">Reviews</Label>
                <Input
                  id="reviews"
                  type="number"
                  min="0"
                  value={formData.reviews}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviews: parseInt(e.target.value) }))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  required
                />
              </div>
              
              {/* Product Options Section */}
              <div className="col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Product Options</Label>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      options: [...(prev.options || []), { name: '', options: [''] }]
                    }))}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
                
                {formData.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label>Option {optionIndex + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            options: prev.options?.filter((_, i) => i !== optionIndex) || []
                          }))
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Option Name</Label>
                        <Input
                          value={option.name}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              options: prev.options?.map((opt, i) =>
                                i === optionIndex ? { ...opt, name: e.target.value } : opt
                              ) || []
                            }))
                          }}
                          placeholder="e.g., Color, Size, Material"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Values</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                options: prev.options?.map((opt, i) =>
                                  i === optionIndex ? { ...opt, options: [...opt.options, ''] } : opt
                                ) || []
                              }))
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Value
                          </Button>
                        </div>
                        
                        {option.options.map((value, valueIndex) => (
                          <div key={valueIndex} className="flex gap-2">
                            <Input
                              value={value}
                              onChange={(e) => {
                                setFormData(prev => ({
                                  ...prev,
                                  options: prev.options?.map((opt, i) =>
                                    i === optionIndex ? {
                                      ...opt,
                                      options: opt.options.map((v, j) =>
                                        j === valueIndex ? e.target.value : v
                                      )
                                    } : opt
                                  ) || []
                                }))
                              }}
                              placeholder="Option value"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  options: prev.options?.map((opt, i) =>
                                    i === optionIndex ? {
                                      ...opt,
                                      options: opt.options.filter((_, j) => j !== valueIndex)
                                    } : opt
                                  ) || []
                                }))
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
          </div>
        </div>

        {/* Filter Modal */}
        <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
          <DialogContent className="max-w-md w-full rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Filter className="h-5 w-5" /> Filters
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products by name, brand, or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <Label htmlFor="category-filter" className="text-sm font-medium">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="rounded-lg border-gray-200">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {getUniqueCategories().map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="brand-filter" className="text-sm font-medium">Brand</Label>
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger className="rounded-lg border-gray-200">
                    <SelectValue placeholder="All brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All brands</SelectItem>
                    {getUniqueBrands().map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price-filter" className="text-sm font-medium">Price Range</Label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="rounded-lg border-gray-200">
                    <SelectValue placeholder="All prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All prices</SelectItem>
                    <SelectItem value="0-100">$0 - $100</SelectItem>
                    <SelectItem value="100-500">$100 - $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1000</SelectItem>
                    <SelectItem value="1000+">$1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2 rounded-lg border-gray-200 hover:bg-gray-100 mt-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Active Filters Summary */}
        {(searchTerm || categoryFilter !== "all" || brandFilter !== "all" || priceRange !== "all") && (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>Active filters:</span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Search: "{searchTerm}"
              </span>
            )}
            {categoryFilter !== "all" && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                Category: {categoryFilter}
              </span>
            )}
            {brandFilter !== "all" && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Brand: {brandFilter}
              </span>
            )}
            {priceRange !== "all" && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                Price: {priceRange === "0-100" ? "$0 - $100" : 
                       priceRange === "100-500" ? "$100 - $500" :
                       priceRange === "500-1000" ? "$500 - $1000" : "$1000+"}
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
      </div>

        <div className="bg-white/90 rounded-2xl shadow-lg border border-gray-100 overflow-x-auto">
        <Table>
            <TableHeader className="sticky top-0 bg-white/95 z-10 shadow-sm">
            <TableRow>
                <TableHead className="py-4 px-6 text-gray-700 font-semibold text-base">Name</TableHead>
                <TableHead className="py-4 px-6 text-gray-700 font-semibold text-base">Brand / Model</TableHead>
                <TableHead className="py-4 px-6 text-gray-700 font-semibold text-base">Price</TableHead>
                <TableHead className="py-4 px-6 text-gray-700 font-semibold text-base">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-400 text-lg">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-400 text-lg">
                    {searchTerm || categoryFilter !== "all" || brandFilter !== "all" || priceRange !== "all"
                      ? "No products found matching your filters."
                      : "No products available."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <TableCell className="py-4 px-6 text-gray-900 font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-gray-700">
                      <span className="font-semibold text-gray-800">{product.brand}</span>
                      <span className="text-gray-400"> / </span>
                      <span>{product.model}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-blue-700 font-bold">
                      {product.price} DHs
                    </TableCell>
                    <TableCell className="py-4 px-6">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                          className="rounded-lg border-gray-200 bg-gray-50 hover:bg-blue-100 text-blue-700 border transition-colors shadow-sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                          className="rounded-lg border-gray-200 bg-gray-50 hover:bg-red-100 text-red-700 border transition-colors shadow-sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
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