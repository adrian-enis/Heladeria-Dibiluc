import express, { type Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './06-routes/index.js'
import { errorHandler } from './07-middlerware/errorHandler.js'
dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3000

app.use(cors()) // Middleware para habilitar CORS, permitiendo que el frontend pueda hacer solicitudes al backend desde un dominio diferente
app.use(express.json()) // Middleware para parsear el cuerpo de las solicitudes como JSON
app.use('/api', router) 

app.get('/api/health', (_req, res) => { // Ruta de prueba para verificar que el servidor está funcionando correctamente
  res.json({ status: 'ok' })
})
app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

export default app
