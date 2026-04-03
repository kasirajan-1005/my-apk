import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/messageController.js';
import { authenticateRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticateRequest);
router.get('/', getMessages);
router.post('/', sendMessage);

export default router;
