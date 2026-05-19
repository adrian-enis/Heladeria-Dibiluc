// src/middleware/validateStock.ts
import type { Request, Response, NextFunction } from 'express'

export const validateStock = (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  const { quantity } = req.body

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: 'ID de producto inválido' })
    return
  }
  if (typeof quantity !== 'number' || quantity <= 0) {
    res.status(400).json({ error: 'quantity debe ser un número mayor a 0' })
    return
  }

  next()
}