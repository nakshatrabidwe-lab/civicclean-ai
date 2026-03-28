import { Router } from 'express'

const router = Router()

/** GET /api/admin/stats  – high-level dashboard numbers */
router.get('/stats', (_req, res) => {
  res.json({
    totalReports:    142,
    openReports:      38,
    inProgress:       27,
    resolved:         77,
    avgResolutionDays: 3.4,
  })
})

export default router
