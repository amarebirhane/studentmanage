import { Router } from 'express';
import * as messageController from './message.controller';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

// Routes are already protected and tenant-isolated by the parent router in routes.ts

router.route('/')
    .get(checkPermission('messages', 'view'), messageController.getInbox)
    .post(checkPermission('messages', 'create'), messageController.sendMessage);

router.get('/inbox', checkPermission('messages', 'view'), messageController.getInbox);
router.get('/sent', checkPermission('messages', 'view'), messageController.getSentMessages);
router.patch('/:id/read', checkPermission('messages', 'edit'), messageController.markAsRead);
router.delete('/:id', checkPermission('messages', 'delete'), messageController.deleteMessage);

export default router;
