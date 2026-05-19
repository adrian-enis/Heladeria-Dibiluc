// src/05-controllers/ProductController.ts
import type { Request, Response } from 'express'
import { productService } from '../04-services/ProductService.js'

export const productController = {

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.getAll()
      res.status(200).json(products)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      res.status(500).json({ error: message })
    }
  },

  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id)
      const { quantity } = req.body

      await productService.decrementStock(id, quantity)
      res.status(204).send()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      const status = message.includes('no encontrado') ? 404
                   : message.includes('insuficiente') ? 409
                   : 500
      res.status(status).json({ error: message })
    }
  },
}