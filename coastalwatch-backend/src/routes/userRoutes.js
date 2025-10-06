import { Router } from 'express';
import { listUsers } from '../controllers/userController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateJWT, authorizeRoles('Admin'), listUsers);

export default router;


