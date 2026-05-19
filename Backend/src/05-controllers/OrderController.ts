// src/05-controllers/OrderController.ts
import type { Request, Response } from 'express'
import { orderService } from '../04-services/OrderService.js'

export const orderController = {

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { customer_name, customer_phone, items } = req.body
      const result = await orderService.createOrder({ customer_name, customer_phone, items })
      res.status(201).json(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      const status = message.includes('no encontrado') ? 404
                   : message.includes('insuficiente') ? 409
                   : 500
      res.status(status).json({ error: message })
    }
  },
}