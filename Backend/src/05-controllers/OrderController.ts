// src/05-controllers/orderController.ts
import type { Request, Response } from 'express'
import { orderService } from '../04-services/OrderService.js'

export const orderController = {

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { customer_name, customer_phone, items } = req.body

      if (!customer_name || typeof customer_name !== 'string') {
        res.status(400).json({ error: 'customer_name es requerido' })
        return
      }
      if (!customer_phone || typeof customer_phone !== 'string') {
        res.status(400).json({ error: 'customer_phone es requerido' })
        return
      }
      if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'items debe ser un arreglo con al menos un producto' })
        return
      }

      const result = await orderService.createOrder({ customer_name, customer_phone, items })
      res.status(201).json(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      const status = message.includes('no encontrado') ? 404
                   : message.includes('insuficiente') ? 409
                   : message.includes('al menos un producto') ? 400
                   : 500
      res.status(status).json({ error: message })
    }
  },
}