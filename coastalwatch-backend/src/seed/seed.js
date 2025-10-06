import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../mg.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Sensor from '../models/Sensor.js';
import Alert from '../models/Alert.js';

async function run() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/coastalwatch';
  await mongoose.connect(mongoUri);

  await Promise.all([User.deleteMany({}), Sensor.deleteMany({}), Alert.deleteMany({})]);

  const salt = await bcrypt.genSalt(10);
  const [admin, researcher, pub] = await User.create([
    { username: 'admin', password: await bcrypt.hash('admin123', salt), role: 'Admin' },
    { username: 'research', password: await bcrypt.hash('research123', salt), role: 'Researcher' },
    { username: 'public', password: await bcrypt.hash('public123', salt), role: 'Public' }
  ]);

  const now = new Date();
  const sensors = Array.from({ length: 30 }).map((_, i) => ({
    location: `Station-${(i % 5) + 1}`,
    water_level: 1.2 + Math.random() * 1.5,
    wind_speed: 5 + Math.random() * 15,
    temperature: 15 + Math.random() * 12,
    timestamp: new Date(now.getTime() - i * 60 * 60 * 1000)
  }));
  await Sensor.insertMany(sensors);

  await Alert.insertMany([
    { type: 'Tide', message: 'High tide approaching', severity: 'medium' },
    { type: 'Storm', message: 'Strong winds detected offshore', severity: 'high' }
  ]);

  // eslint-disable-next-line no-console
  console.log('Seed complete:', { users: [admin.username, researcher.username, pub.username] });
  await mongoose.disconnect();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


