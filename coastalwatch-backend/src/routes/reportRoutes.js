import { Router } from 'express';
import { getSummaryReport } from '../controllers/reportController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateJWT, authorizeRoles('Researcher', 'Admin'), getSummaryReport);

export default router;


