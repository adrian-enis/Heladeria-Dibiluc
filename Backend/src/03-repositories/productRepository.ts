// src/repositories/productRepository.ts
import { supabase } from '../01-config/database.js'
import type { Product } from '../02-models/Product.js'

export const productRepository = {

  async findAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw new Error(`Error al obtener productos: ${error.message}`)
    return data as Product[]
  },

  async findById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error al obtener producto ${id}: ${error.message}`)
    }
    return data as Product | null
  },

  async updateStock(id: number, newStock: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', id)

    if (error) throw new Error(`Error al actualizar stock del producto ${id}: ${error.message}`)
  },
}