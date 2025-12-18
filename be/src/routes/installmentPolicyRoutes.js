import express from 'express';
import {
    getAllPolicies,
    getActivePolicies,
    createPolicy,
    updatePolicy,
    deletePolicy,
    togglePolicyStatus
} from '../controllers/installmentPolicyController.js';
import { requireAdminAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes - Lấy chính sách đang hoạt động (cho user)
router.get('/active', getActivePolicies);

// Admin routes - Quản lý chính sách
router.get('/', requireAdminAuth, getAllPolicies);
router.post('/', requireAdminAuth, createPolicy);
router.put('/:id', requireAdminAuth, updatePolicy);
router.patch('/:id/toggle', requireAdminAuth, togglePolicyStatus);
router.delete('/:id', requireAdminAuth, deletePolicy);

export default router;
