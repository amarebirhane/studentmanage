import { Router } from 'express';
import { ExpenseController } from './expense.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, authorize('ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), ExpenseController.create);
router.get('/', protect, authorize('ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), ExpenseController.getAll);
router.get('/summary', protect, authorize('ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), ExpenseController.getSummary);
router.put('/:id', protect, authorize('ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), ExpenseController.update);
router.delete('/:id', protect, authorize('ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), ExpenseController.delete);

export default router;
