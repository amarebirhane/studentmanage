import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import studentRoutes from './modules/students/student.routes';
import classRoutes from './modules/classes/class.routes';
import userRoutes from './modules/users/user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/classes', classRoutes);
router.use('/admin', userRoutes);

export default router;
