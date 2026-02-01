import { Router } from 'express';
import * as announcementController from './announcement.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(protect);

router.post('/', authorize(UserRole.ADMIN, UserRole.TEACHER), announcementController.createAnnouncement);
router.get('/', announcementController.getAnnouncements);
router.get('/:id', announcementController.getAnnouncement);
router.patch('/:id', authorize(UserRole.ADMIN, UserRole.TEACHER), announcementController.updateAnnouncement);
router.delete('/:id', authorize(UserRole.ADMIN), announcementController.deleteAnnouncement);

export default router;
