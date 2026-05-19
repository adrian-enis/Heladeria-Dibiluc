// src/06-routes/orderRoutes.ts
import { Router } from 'express'
import { orderController } from '../05-controllers/OrderController.js'

const router : Router = Router()

router.post('/', orderController.createOrder) // Define la ruta POST /orders para crear una nueva orden, delegando la lógica al controlador

export default router