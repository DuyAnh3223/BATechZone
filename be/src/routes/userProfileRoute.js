import express from 'express';
import { getProfile, updateProfile } from '../controllers/userProfileController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(requireAuth);

router.get('/', getProfile);
router.put('/', updateProfile);

export default router;

