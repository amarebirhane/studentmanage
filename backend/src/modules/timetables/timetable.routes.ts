import { Router } from 'express';
import * as timetableController from './timetable.controller';
import { protect } from '../../middlewares/auth.middleware';
import { tenantMiddleware } from '../../middlewares/tenant.middleware';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

router.use(protect);
router.use(tenantMiddleware);

router.post('/', checkPermission('timetable', 'create'), timetableController.createEntry);
router.get('/', checkPermission('timetable', 'view'), timetableController.getTimetable);
router.patch('/:id', checkPermission('timetable', 'edit'), timetableController.updateEntry);
router.delete('/:id', checkPermission('timetable', 'delete'), timetableController.deleteEntry);

export default router;
