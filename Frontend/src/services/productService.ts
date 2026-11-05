// src/services/productService.ts
import type { Product } from '../types/index'

const API_URL = import.meta.env.VITE_API_URL

export const productService = {

  async getAll(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`)

    if (!response.ok) {
      throw new Error('Error al obtener los productos')
    }

    return response.json()
  },
}