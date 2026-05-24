// src/middleware/validateOrder.ts
import type { Request, Response, NextFunction } from 'express'

// Middleware para validar los datos de una orden antes de que lleguen al controlador, 
// asegurando que se cumplan los requisitos básicos para crear una orden
export const validateOrder = (req: Request, res: Response, next: NextFunction): void => { 
  const { customer_name, customer_phone, items } = req.body 

  if (!customer_name || typeof customer_name !== 'string' || customer_name.trim() === '') {
    res.status(400).json({ error: 'customer_name es requerido y debe ser texto' })
    return
  }
  if (!customer_phone || typeof customer_phone !== 'string' || customer_phone.trim() === '') {
    res.status(400).json({ error: 'customer_phone es requerido y debe ser texto' })
    return
  }
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'items debe ser un arreglo con al menos un producto' })
    return
  }

  const itemsValidos = items.every(
    (item) =>
      typeof item.product_id === 'number' &&
      typeof item.quantity === 'number' &&
      item.quantity > 0
  )

  if (!itemsValidos) {
    res.status(400).json({ error: 'Cada item debe tener product_id y quantity válidos (quantity > 0)' })
    return
  }

  next()
}