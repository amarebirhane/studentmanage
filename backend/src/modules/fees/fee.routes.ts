import { Router } from 'express';
import * as feeController from './fee.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(protect);

router.post('/', authorize(UserRole.ADMIN), feeController.createFeeInvoice);
router.get('/', authorize(UserRole.ADMIN, UserRole.PARENT, UserRole.STUDENT), feeController.getAllFeeInvoices);
router.get('/:id', authorize(UserRole.ADMIN, UserRole.PARENT, UserRole.STUDENT), feeController.getFeeInvoice);
router.patch('/:id', authorize(UserRole.ADMIN), feeController.updateFeeInvoice);
router.delete('/:id', authorize(UserRole.ADMIN), feeController.deleteFeeInvoice);

export default router;
