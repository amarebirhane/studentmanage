import { Router } from 'express';
import * as announcementController from './announcement.controller';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

// Routes are already protected and tenant-isolated by the parent router in routes.ts

router.post('/', checkPermission('announcements', 'create'), announcementController.createAnnouncement);
router.get('/', checkPermission('announcements', 'view'), announcementController.getAnnouncements);
router.get('/:id', checkPermission('announcements', 'view'), announcementController.getAnnouncement);
router.patch('/:id', checkPermission('announcements', 'edit'), announcementController.updateAnnouncement);
router.delete('/:id', checkPermission('announcements', 'delete'), announcementController.deleteAnnouncement);

export default router;
