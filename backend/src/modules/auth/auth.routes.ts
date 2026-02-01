import { Router } from 'express';
import { AuthController } from './auth.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', protect, AuthController.logout);
router.get('/profile', protect, AuthController.getProfile);

export default router;
