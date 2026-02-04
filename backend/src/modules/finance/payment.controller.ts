import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import { PaymentService } from './payment.service';
import { ApiResponse } from '../../utils/apiResponse';

export class PaymentController {
    static async initialize(req: AuthenticatedRequest, res: Response) {
        try {
            const { amount, invoiceId, studentId, email, firstName, lastName } = req.body;

            // Basic validation
            if (!amount || !email) {
                return ApiResponse.error(res, 'Amount and Email are required', 400);
            }

            const result = await PaymentService.initializePayment({
                amount,
                email,
                firstName: firstName || req.user?.firstName || 'Guest',
                lastName: lastName || req.user?.lastName || 'Guest',
                userId: req.user!.id,
                schoolId: req.user!.schoolId!,
                studentId: studentId, // Should be passed or derived
                invoiceId: invoiceId
            });

            return ApiResponse.success(res, result, 'Payment initialized');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, error.statusCode || 500);
        }
    }

    static async verify(req: AuthenticatedRequest, res: Response) {
        try {
            const { tx_ref } = req.params;
            const result = await PaymentService.verifyPayment(tx_ref as string);
            return ApiResponse.success(res, result, 'Verification process completed');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, error.statusCode || 500);
        }
    }

    static async getTransactions(req: AuthenticatedRequest, res: Response) {
        try {
            const transactions = await PaymentService.getTransactions(req.user!.schoolId!);
            return ApiResponse.success(res, transactions, 'Transactions fetched');
        } catch (error: any) {
            return ApiResponse.error(res, error.message, error.statusCode || 500);
        }
    }
}
