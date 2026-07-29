import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
  issueId: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, default: 'Solid Waste' },
  status: { type: String, default: 'PENDING' },
  aiConfidence: { type: String, default: '96% AI Verified' },
  image: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Issue', IssueSchema);
