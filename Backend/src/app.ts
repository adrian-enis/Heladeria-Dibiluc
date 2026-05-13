import express, { type Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

export default app
