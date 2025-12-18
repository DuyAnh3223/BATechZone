import express from 'express';
import { listAddresses, getAddressById, createAddress, updateAddress, deleteAddress } from '../controllers/addressController.js';
import { requireUserAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tất cả routes đều cần authentication (chỉ user)
router.use(requireUserAuth);

router.get('/', listAddresses);
router.get('/:addressId', getAddressById);
router.post('/', createAddress);
router.put('/:addressId', updateAddress);
router.delete('/:addressId', deleteAddress);

export default router;

