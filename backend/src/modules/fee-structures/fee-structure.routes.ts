import { Router } from 'express';
import * as feeStructureController from './fee-structure.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();

router.use(protect); // All routes require authentication

// Accountant and Admin can manage fee structures
router.post(
    '/',
    authorize('ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN' as any),
    feeStructureController.createFeeStructure
);

router.get(
    '/',
    authorize('ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN' as any),
    feeStructureController.getAllFeeStructures
);

router.get('/:id', feeStructureController.getFeeStructureById);

router.patch(
    '/:id',
    authorize('ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN' as any),
    feeStructureController.updateFeeStructure
);

router.delete(
    '/:id',
    authorize('ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN' as any),
    feeStructureController.deleteFeeStructure
);

router.post(
    '/bulk-invoices',
    authorize('ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN' as any),
    feeStructureController.bulkGenerateInvoices
);

export default router;
