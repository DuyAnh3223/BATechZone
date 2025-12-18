import express from 'express';
import {listUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { requireAdminAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tất cả routes đều cần authentication (chỉ admin)
router.use(requireAdminAuth);

router.get('/', listUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router;