import { Router } from 'express';
import { listAlerts, createAlert } from '../controllers/alertController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', listAlerts);
router.post('/', authenticateJWT, authorizeRoles('Admin', 'Researcher'), createAlert);

export default router;


