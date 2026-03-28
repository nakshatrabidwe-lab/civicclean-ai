import 'dotenv/config'
import express from 'express'
import cors    from 'cors'
import morgan  from 'morgan'

import reportsRouter  from './routes/reports.js'
import usersRouter    from './routes/users.js'
import adminRouter    from './routes/admin.js'

const app  = express()
const PORT = process.env.PORT ?? 3001

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())
app.use(morgan('dev'))

// ── Routes ────────────────────────────────────────────────────
app.use('/api/reports', reportsRouter)
app.use('/api/users',   usersRouter)
app.use('/api/admin',   adminRouter)

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`\n🚀  CivicClean AI backend running on http://localhost:${PORT}\n`)
})
