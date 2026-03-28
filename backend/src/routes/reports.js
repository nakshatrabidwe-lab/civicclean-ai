import { Router } from 'express'

const router = Router()

// In-memory store – swap for a DB later
let reports = []
let nextId  = 1

/** GET /api/reports  – list all reports (supports ?status= filter) */
router.get('/', (req, res) => {
  const { status } = req.query
  const filtered = status
    ? reports.filter(r => r.status === status)
    : reports
  res.json(filtered)
})

/** GET /api/reports/:id */
router.get('/:id', (req, res) => {
  const report = reports.find(r => r.id === Number(req.params.id))
  if (!report) return res.status(404).json({ message: 'Report not found' })
  res.json(report)
})

/** POST /api/reports  – citizen submits a new issue */
router.post('/', (req, res) => {
  const { title, description, category, location, citizenId } = req.body
  if (!title || !description) {
    return res.status(400).json({ message: '`title` and `description` are required' })
  }

  const report = {
    id: nextId++,
    title,
    description,
    category:   category  ?? 'uncategorised',
    location:   location  ?? null,
    citizenId:  citizenId ?? null,
    status:     'open',
    priority:   'normal',
    createdAt:  new Date().toISOString(),
    updatedAt:  new Date().toISOString(),
  }

  reports.push(report)
  res.status(201).json(report)
})

/** PATCH /api/reports/:id  – admin updates status/priority */
router.patch('/:id', (req, res) => {
  const idx = reports.findIndex(r => r.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ message: 'Report not found' })

  reports[idx] = {
    ...reports[idx],
    ...req.body,
    id:        reports[idx].id,           // immutable
    updatedAt: new Date().toISOString(),
  }
  res.json(reports[idx])
})

/** DELETE /api/reports/:id */
router.delete('/:id', (req, res) => {
  const before = reports.length
  reports = reports.filter(r => r.id !== Number(req.params.id))
  if (reports.length === before) {
    return res.status(404).json({ message: 'Report not found' })
  }
  res.status(204).send()
})

export default router
