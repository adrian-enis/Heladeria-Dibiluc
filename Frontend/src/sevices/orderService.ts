// src/services/orderService.ts
import type { Order } from '../types/index'

const API_URL = import.meta.env.VITE_API_URL

export const orderService = {

  async create(order: Order): Promise<void> {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      const { error } = await response.json()
      throw new Error(error ?? 'Error al crear el pedido')
    }
  },
}