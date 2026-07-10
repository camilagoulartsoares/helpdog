import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { campaignRouter } from './routes/campaign.js'
import { donationsRouter } from './routes/donations.js'

const app = express()
const port = Number(process.env.PORT || 3333)
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'

app.use(
  cors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
  }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'helpdog-api' })
})

app.use('/api/campaign', campaignRouter)
app.use('/api/donations', donationsRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' })
})

app.listen(port, () => {
  console.log(`HelpDog API rodando em http://localhost:${port}`)
})
