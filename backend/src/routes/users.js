import { Router } from 'express'

const router = Router()

/** GET /api/users/me  – placeholder: return mock citizen profile */
router.get('/me', (_req, res) => {
  res.json({
    id: 'citizen-001',
    name: 'Demo Citizen',
    email: 'citizen@civicclean.ai',
    role: 'citizen',
    city: 'Nashik',
    joinedAt: '2024-01-15T00:00:00.000Z',
  })
})

export default router
