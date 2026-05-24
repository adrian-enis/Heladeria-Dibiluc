// src/services/orderService.ts
import { orderRepository } from '../03-repositories/orderRepository.js'
import { productRepository } from '../03-repositories/productRepository.js'
import { productService } from './ProductService.js'
import type { CreateOrderDTO } from '../02-models/Order.js'

export const orderService = {

  async createOrder(dto: CreateOrderDTO) {
    // 1. Validar que el carrito no esté vacío
    if (!dto.items || dto.items.length === 0) {
      throw new Error('El pedido debe tener al menos un producto')
    }

    // 2. Verificar que cada producto existe y tiene stock suficiente
    const enrichedItems = await Promise.all(
      dto.items.map(async (item) => {
        const product = await productRepository.findById(item.product_id)

        if (!product) {
          throw new Error(`Producto ${item.product_id} no encontrado`)
        }
        // if (product.stock < item.quantity) {                               // ProductService.decrementStock ya hace esta validación, no es necesario repetirla aquí
        //   throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}`)
        // }

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: product.price, // snapshot del precio actual
          stock: product.stock,
          name: product.name,
        }
      })
    )

    // 3. Calcular total
    const total_amount = enrichedItems.reduce(
      (acc, item) => acc + item.price_at_purchase * item.quantity,
      0
    )

    // 4. Crear la orden
    const order = await orderRepository.createOrder(
      {
        customer_name: dto.customer_name,
        customer_phone: dto.customer_phone,
      },
      total_amount
    )

    // 5. Crear los items
    const orderItems = await orderRepository.createOrderItems(
      order.id,
      enrichedItems
    )

    // 6. Descontar stock de cada producto
    await Promise.all(
      enrichedItems.map((item) =>
        productService.decrementStock(item.product_id, item.quantity)
      )
    )

    return { order, orderItems }
  },
}