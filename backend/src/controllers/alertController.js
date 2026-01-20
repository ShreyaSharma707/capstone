import Alert from '../models/Alert.js';

export async function listAlerts(req, res) {
  const alerts = await Alert.find({}).sort({ timestamp: -1 }).limit(200);
  return res.json(alerts);
}

export async function createAlert(req, res) {
  const { type, message, severity } = req.body;
  if (!type || !message || !severity) {
    return res.status(400).json({ message: 'type, message, severity are required' });
  }
  const alert = await Alert.create({ type, message, severity });
  // Emit real-time event via Socket.io (set on app)
  const io = req.app.get('io');
  if (io) {
    io.emit('alert:new', alert);
  }
  return res.status(201).json(alert);
}


