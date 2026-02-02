import { Router } from 'express';
import * as feeStructureController from './fee-structure.controller';
import { checkPermission } from '../../middlewares/permission.middleware';

const router = Router();

// Routes are already protected and tenant-isolated by the parent router in routes.ts

// Accountant and Admin can manage fee structures
router.post(
    '/',
    checkPermission('fee-structures', 'create'),
    feeStructureController.createFeeStructure
);

router.get(
    '/',
    checkPermission('fee-structures', 'view'),
    feeStructureController.getAllFeeStructures
);

router.get('/:id', checkPermission('fee-structures', 'view'), feeStructureController.getFeeStructureById);

router.patch(
    '/:id',
    checkPermission('fee-structures', 'edit'),
    feeStructureController.updateFeeStructure
);

router.delete(
    '/:id',
    checkPermission('fee-structures', 'delete'),
    feeStructureController.deleteFeeStructure
);

router.post(
    '/bulk-invoices',
    checkPermission('fee-structures', 'edit'), // Generating invoices is an 'edit' or 'create' action on structures/invoices
    feeStructureController.bulkGenerateInvoices
);

export default router;
