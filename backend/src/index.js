import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);
import marketplaceRouter from './routes/marketplace.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import reportsRouter from './routes/reports.js';
import cctvRouter from './routes/cctv.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configured with your username nakshatrabidwe_db_user
const ATLAS_URI = 'mongodb+srv://nakshatrabidwe_db_user:gWKVckf6zpe8uhBd@cluster0.xmm7huo.mongodb.net/civicclean_db?retryWrites=true&w=majority';

const MONGO_URI = process.env.MONGO_URI && process.env.MONGO_URI.startsWith('mongodb') 
  ? process.env.MONGO_URI 
  : ATLAS_URI;

console.log('📡 Connecting to MongoDB Atlas...');

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Database successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/reports', reportsRouter);
app.use('/api/cctv', cctvRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 CivicClean Backend Server running on http://localhost:${PORT}`));
app.use('/api/reports', reportsRouter);
app.use('/api/cctv', cctvRouter);
app.use('/api/marketplace', marketplaceRouter);