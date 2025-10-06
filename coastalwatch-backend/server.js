import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve mg.env relative to this file to avoid CWD issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'mg.env') });

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import mongoose from 'mongoose';

import authRoutes from './src/routes/authRoutes.js';
import sensorRoutes from './src/routes/sensorRoutes.js';
import alertRoutes from './src/routes/alertRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.set('io', io);

io.on('connection', (socket) => {
  // You can add rooms/namespaces later if needed
  socket.emit('connection', { message: 'Connected to CoastalWatch alerts' });
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 4000;

if (!process.env.MONGO_URI) {
  // eslint-disable-next-line no-console
  console.error('MONGO_URI env not found. Expected mg.env at:', path.join(__dirname, 'mg.env'));
}

// DB health endpoint
app.get('/health/db', async (req, res) => {
  const state = mongoose.connection.readyState;
  const stateText = ({ 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' })[state] || 'unknown';
  res.json({ state, stateText });
});

connectDB(process.env.MONGO_URI)
  .then(async () => {
    // Perform a lightweight write so the DB/collection appears in Atlas immediately
    try {
      const db = mongoose.connection.db;
      await db.collection('init').updateOne(
        { _id: 'startup-ping' },
        { $set: { lastSeenAt: new Date() } },
        { upsert: true }
      );
      // eslint-disable-next-line no-console
      console.log('Startup ping written to MongoDB');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Startup ping failed (non-fatal):', e?.message || e);
    }

    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });


