import { Router } from 'express';
import { updateOwnWallpaper, updateProfilePicture } from '../controllers/userController.js';
import { authenticateRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticateRequest);
router.put('/me/profile', updateProfilePicture);
router.put('/me/wallpaper', updateOwnWallpaper);

export default router;
