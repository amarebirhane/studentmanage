import { Router } from 'express';
import { AuthController } from './auth.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh', AuthController.refresh);
router.get('/profile', protect, AuthController.getProfile);
router.put('/profile', protect, AuthController.updateProfile);
router.patch('/change-password', protect, AuthController.changePassword);

// 2FA Routes
router.post('/2fa/generate', protect, AuthController.generateTwoFactor);
router.post('/2fa/enable', protect, AuthController.enableTwoFactor);
router.post('/2fa/verify', protect, AuthController.verifyTwoFactor);
router.post('/2fa/disable', protect, AuthController.disableTwoFactor);

export default router;
