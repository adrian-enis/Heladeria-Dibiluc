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
        if (!data) return [] // Si no hay datos, devuelve un array vacío
        return data // Devuelve el array de productos obtenidos de la base de datos
    },

    async findById(id: number): Promise<Product | null> {
        const { data, error } = await supabase // Inicia la consulta a Supabase
            .from('products') // Especifica la tabla 'products' en la consulta
            .select('*')      // Selecciona todas las columnas del producto
            .eq('id', id)     // Filtra por el ID del producto
            .single()         // .single() asegura que solo se devuelva un producto o null

        if (error && error.code !== 'PGRST116') { // PGRST116 es el código de error para "No rows found", lo cual es esperado si el producto no existe
            throw new Error(`Error al obtener producto ${id}: ${error.message}`)
        }
        if (!data) return null 
        return data
    },

    async updateStock(id: number, newStock: number): Promise<void> { // Método para actualizar el stock de un producto
        const { error } = await supabase 
            .from('products')
            .update({ stock: newStock }) // Actualiza el campo 'stock' con el nuevo valor
            .eq('id', id)

        if (error) throw new Error(`Error al actualizar stock del producto ${id}: ${error.message}`)
    },
}