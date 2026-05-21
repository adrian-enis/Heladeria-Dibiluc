// src/types/index.ts

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  customer_name: string
  customer_phone: string
  items: {
    product_id: number
    quantity: number
  }[]
}