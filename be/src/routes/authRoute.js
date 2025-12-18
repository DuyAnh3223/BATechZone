import express from 'express';
import { 
    signUp, 
    signIn, 
    signOut, 
    adminSignIn, 
    getMe, 
    getAdminMe, 
    getUserMe,
    refreshAdminToken,
    refreshUserToken
} from '../controllers/authController.js';
import { requireAdminAuth, requireUserAuth, requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/admin_signin', adminSignIn);

// Protected routes (require authentication)
router.post('/signout', signOut);
router.get('/me', getMe);
router.get('/admin/me', requireAdminAuth, getAdminMe);
router.get('/user/me', requireUserAuth, getUserMe);

// JWT refresh token routes
router.post('/refresh-admin', refreshAdminToken);
router.post('/refresh-user', refreshUserToken);

export default router;