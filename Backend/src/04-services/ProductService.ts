// src/services/productService.ts
import { productRepository } from '../03-repositories/productRepository.js'
import type { Product } from '../02-models/Product.js'

export const productService = {

  async getAll(): Promise<Product[]> { // Método para obtener todos los productos
    return productRepository.findAll() // Llama al método findAll del repositorio para obtener los productos
  },

  async decrementStock(id: number, quantity: number): Promise<void> { 
    const product = await productRepository.findById(id)

    if (!product) {
      throw new Error(`Producto ${id} no encontrado`)
    }
    if (quantity <= 0) { // Validación para asegurar que la cantidad a decrementar sea mayor a 0
      throw new Error(`La cantidad debe ser mayor a 0`)
    }
    if (product.stock < quantity) { // Validación para asegurar que el stock disponible sea suficiente para la cantidad a decrementar
      throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}`)
    }

    await productRepository.updateStock(id, product.stock - quantity)
  },
}