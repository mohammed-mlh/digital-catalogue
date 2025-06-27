export interface Product {
  id: string
  name: string
  brand: string
  model: string
  category: string
  price: string
  image: string
  description: string
  optionIds: string[]
}

import { Option } from "./option";

export interface ProductWithOptions extends Omit<Product, 'optionIds'> {
  options: Option[];
}

export type ProductInput = Omit<Product, 'id'> 