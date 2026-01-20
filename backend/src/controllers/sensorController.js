import Sensor from '../models/Sensor.js';

export async function listSensors(req, res) {
  const sensors = await Sensor.find({}).sort({ timestamp: -1 }).limit(200);
  return res.json(sensors);
}


