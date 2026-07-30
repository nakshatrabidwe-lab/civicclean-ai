import mongoose from 'mongoose';

const CCTVSchema = new mongoose.Schema({
  cameraId: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, default: 'ACTIVE' },
  aiAlert: { type: String, default: 'AI Monitoring Active' },
  streamUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CCTV', CCTVSchema);