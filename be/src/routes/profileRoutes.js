import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { requireUserAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tất cả routes đều cần authentication (chỉ user)
router.use(requireUserAuth);

router.get('/', getProfile);
router.put('/', updateProfile);

export default router;

