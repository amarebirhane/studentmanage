import { Router } from 'express';
import * as feeController from './fee.controller';
import { protect } from '../../middlewares/auth.middleware';
import { tenantMiddleware } from '../../middlewares/tenant.middleware';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

// Apply protection and tenant isolation to all fee routes
router.use(protect, tenantMiddleware);

router.post('/', checkPermission('fees', 'create'), feeController.createFeeInvoice);
router.get('/', checkPermission('fees', 'view'), feeController.getAllFeeInvoices);
router.get('/:id', checkPermission('fees', 'view'), feeController.getFeeInvoice);
router.patch('/:id', checkPermission('fees', 'edit'), feeController.updateFeeInvoice);
router.patch('/:id/adjustment', checkPermission('fees', 'edit'), feeController.applyAdjustment);
router.delete('/:id', checkPermission('fees', 'delete'), feeController.deleteFeeInvoice);
router.post('/:id/payments', checkPermission('fees', 'edit'), feeController.recordPayment);

export default router;
