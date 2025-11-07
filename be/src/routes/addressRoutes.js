import express from 'express';
import { listAddresses, getAddressById, createAddress, updateAddress, deleteAddress } from '../controllers/addressController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(requireAuth);

router.get('/', listAddresses);
router.get('/:addressId', getAddressById);
router.post('/', createAddress);
router.put('/:addressId', updateAddress);
router.delete('/:addressId', deleteAddress);

export default router;

