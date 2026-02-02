import { Router } from 'express';
import * as permissionController from './permission.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();

router.use(protect); // All routes require authentication

// Only admins can manage permissions
router.post(
    '/',
    authorize('ADMIN', 'SUPER_ADMIN' as any),
    permissionController.createPermission
);

router.post(
    '/bulk',
    authorize('ADMIN', 'SUPER_ADMIN' as any),
    permissionController.bulkCreatePermissions
);

router.patch(
    '/:userId/:module',
    authorize('ADMIN', 'SUPER_ADMIN' as any),
    permissionController.updatePermission
);

router.delete(
    '/:userId/:module',
    authorize('ADMIN', 'SUPER_ADMIN' as any),
    permissionController.deletePermission
);

// Get permissions for a user
router.get('/:userId', permissionController.getUserPermissions);

// Check specific permission
router.get('/:userId/:module/check', permissionController.checkPermission);

// Get all users with permissions for a module
router.get(
    '/module/:module',
    authorize('ADMIN', 'SUPER_ADMIN' as any),
    permissionController.getModulePermissions
);

export default router;
