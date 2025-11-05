import express from 'express';
import { createUser, updateUser, getUserById, listUsers } from '../controllers/adminUserController.js';

const router = express.Router();

// Route để admin lấy danh sách users (có filter/pagination)
router.get('/users', listUsers);

// Route để admin tạo user mới
router.post('/users', createUser);

// Route để admin lấy thông tin user theo ID
router.get('/users/:userId', getUserById);

// Route để admin cập nhật user
router.put('/users/:userId', updateUser);

export default router;
