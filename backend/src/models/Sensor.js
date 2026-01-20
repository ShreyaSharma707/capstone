import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    water_level: { type: Number, required: true },
    wind_speed: { type: Number, required: true },
    temperature: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Sensor', sensorSchema);


