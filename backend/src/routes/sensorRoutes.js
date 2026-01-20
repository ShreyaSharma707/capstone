import { Router } from 'express';
import { listSensors } from '../controllers/sensorController.js';

const router = Router();

router.get('/', listSensors);

export default router;


