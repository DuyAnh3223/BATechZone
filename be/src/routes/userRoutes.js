import express from 'express';
import {listUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(requireAuth);

router.get('/', listUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router;