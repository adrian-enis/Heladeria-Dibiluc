// src/services/productService.ts
import { productRepository } from '../03-repositories/productRepository.js'
import type { Product } from '../02-models/Product.js'

export const productService = {

  async getAll(): Promise<Product[]> {
    return productRepository.findAll()
  },

  async decrementStock(id: number, quantity: number): Promise<void> {
    const product = await productRepository.findById(id)

    if (!product) {
      throw new Error(`Producto ${id} no encontrado`)
    }
    if (quantity <= 0) {
      throw new Error(`La cantidad debe ser mayor a 0`)
    }
    if (product.stock < quantity) {
      throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}`)
    }

    await productRepository.updateStock(id, product.stock - quantity)
  },
}