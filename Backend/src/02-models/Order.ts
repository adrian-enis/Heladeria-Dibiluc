// src/models/Order.ts
export interface Order {
  id: number
  customer_name: string
  customer_phone: string
  total_amount: number
  order_date: Date
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price_at_purchase: number
}

export interface CreateOrderDTO {
  customer_name: string
  customer_phone: string
  items: {
    product_id: number
    quantity: number

  }[]
}