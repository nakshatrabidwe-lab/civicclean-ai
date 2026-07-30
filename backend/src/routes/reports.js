import express from 'express';
import Issue from '../models/Issue.js';

const router = express.Router();

// GET all reported issues
router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new grievance
router.post('/', async (req, res) => {
  try {
    const newIssue = new Issue({
      issueId: `ISS-${Math.floor(1000 + Math.random() * 9000)}`,
      title: req.body.title,
      location: req.body.location,
      category: req.body.category,
      description: req.body.description,
      image: req.body.imagePreview || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
    });
    const saved = await newIssue.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;