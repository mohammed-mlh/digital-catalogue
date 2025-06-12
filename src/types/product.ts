export interface ProductOption {
  name: string
  options: string[]
}

export interface Product {
  id: string
  name: string
  brand: string
  model: string
  category: string
  price: string
  image: string
  description: string
  rating: number
  reviews: number
  options: ProductOption[]
}

export type ProductInput = Omit<Product, 'id'> 