import express from 'express';
import {listUsers, createUser, getUserById, updateUser } from '../controllers/userController.js';

const router = express.Router();
router.get('/', listUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);

export default router;