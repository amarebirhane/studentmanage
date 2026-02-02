import { Router } from 'express';
import * as messageController from './message.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();

router.use(protect); // All routes require authentication

router.post('/', messageController.sendMessage);
router.get('/inbox', messageController.getInbox);
router.get('/sent', messageController.getSentMessages);
router.patch('/:id/read', messageController.markAsRead);
router.delete('/:id', messageController.deleteMessage);

export default router;
