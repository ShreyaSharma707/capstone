import Sensor from '../models/Sensor.js';
import Alert from '../models/Alert.js';

export async function getSummaryReport(req, res) {
  const latestSensors = await Sensor.find({}).sort({ timestamp: -1 }).limit(20);
  const latestAlerts = await Alert.find({}).sort({ timestamp: -1 }).limit(20);
  const aggregates = await Sensor.aggregate([
    { $group: { _id: null, avgTemp: { $avg: '$temperature' }, avgWind: { $avg: '$wind_speed' }, avgWater: { $avg: '$water_level' } } },
    { $project: { _id: 0 } }
  ]);
  const summary = aggregates[0] || { avgTemp: null, avgWind: null, avgWater: null };
  return res.json({ summary, latestSensors, latestAlerts });
}


