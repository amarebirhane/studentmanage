import { Router } from 'express';
import * as platformController from './platform.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.get('/stats', platformController.getGlobalStats);
router.get('/logs', platformController.getSystemLogs);

export default router;
