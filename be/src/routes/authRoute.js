import express from 'express';
import { signUp, signIn, signOut, adminSignIn, getMe, getAdminMe, getUserMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/admin_signin', adminSignIn);
router.get('/me', getMe);
router.get('/admin/me', getAdminMe);
router.get('/user/me', getUserMe);

export default router;