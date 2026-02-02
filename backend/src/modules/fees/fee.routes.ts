import { Router } from 'express';
import * as feeController from './fee.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(protect);

router.post('/', authorize('ADMIN', 'ACCOUNTANT'), feeController.createFeeInvoice);
router.get('/', authorize('ADMIN', 'ACCOUNTANT', 'PARENT', 'STUDENT'), feeController.getAllFeeInvoices);
router.get('/:id', authorize('ADMIN', 'ACCOUNTANT', 'PARENT', 'STUDENT'), feeController.getFeeInvoice);
router.patch('/:id', authorize('ADMIN', 'ACCOUNTANT'), feeController.updateFeeInvoice);
router.patch('/:id/adjustment', authorize('ADMIN', 'ACCOUNTANT'), feeController.applyAdjustment);
router.delete('/:id', authorize('ADMIN', 'ACCOUNTANT'), feeController.deleteFeeInvoice);

export default router;
