import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const listingSchema = new mongoose.Schema({
  title: String,
  category: String,
  condition: String,
  quantity: String,
  price: Number,
  description: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
});

const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);

// GET all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new listing
router.post('/', async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;