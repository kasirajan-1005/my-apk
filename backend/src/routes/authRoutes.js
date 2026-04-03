import { Router } from 'express';
import { getCurrentSession, login } from '../controllers/authController.js';
import { authenticateRequest } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', authenticateRequest, getCurrentSession);

export default router;
