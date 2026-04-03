import { Router } from 'express';
import {
  getAdminSettings,
  getChats,
  getPublicSettings,
  overrideUserWallpaper,
  updateAdminSettings
} from '../controllers/adminController.js';
import { authenticateRequest, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/settings/public', getPublicSettings);
router.use(authenticateRequest, requireAdmin);
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);
router.get('/chats', getChats);
router.put('/users/:mobileNumber/wallpaper', overrideUserWallpaper);

export default router;
