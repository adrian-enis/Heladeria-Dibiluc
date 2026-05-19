// src/06-routes/index.ts
import { Router } from 'express'
import productRoutes from './productRoutes.js'
import orderRoutes from './orderRoutes.js'

const router: Router = Router()

router.use('/products', productRoutes) // Define que todas las rutas relacionadas con productos estarán bajo el prefijo /products, delegando la lógica a productRoutes
router.use('/orders', orderRoutes) // Define que todas las rutas relacionadas con órdenes estarán bajo el prefijo /orders, delegando la lógica a orderRoutes

export default router