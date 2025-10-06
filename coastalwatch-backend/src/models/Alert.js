import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Alert', alertSchema);


