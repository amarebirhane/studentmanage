import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/initialize', protect, PaymentController.initialize);
router.get('/verify/:tx_ref', protect, PaymentController.verify);
router.get('/', protect, authorize('ADMIN', 'ACCOUNTANT'), PaymentController.getTransactions);

export default router;
