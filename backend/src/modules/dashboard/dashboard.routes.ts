import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { protect } from '../../middlewares/auth.middleware';
import { tenantMiddleware } from '../../middlewares/tenant.middleware';

const router = Router();

router.get('/', protect, tenantMiddleware, DashboardController.getDashboard);

export default router;
