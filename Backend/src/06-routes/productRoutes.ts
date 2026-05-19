// src/06-routes/productRoutes.ts
import { Router } from 'express'
import { productController } from '../05-controllers/ProductController.js'
import { validateStock } from '../07-middlerware/validateStock.js'

const router: Router = Router()

router.get('/', productController.getAll)
router.patch('/:id/stock', validateStock, productController.updateStock)

export default router