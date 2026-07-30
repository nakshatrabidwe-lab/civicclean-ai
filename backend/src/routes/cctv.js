import express from 'express';
import CCTV from '../models/CCTV.js';

const router = express.Router();

// GET all CCTV streams
router.get('/', async (req, res) => {
  try {
    const feeds = await CCTV.find().sort({ createdAt: -1 });
    res.json(feeds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new CCTV stream connection
router.post('/', async (req, res) => {
  try {
    const count = await CCTV.countDocuments();
    const newFeed = new CCTV({
      cameraId: `CAM-0${count + 1}`,
      name: req.body.name,
      location: req.body.location,
      streamUrl: req.body.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    });
    const saved = await newFeed.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;