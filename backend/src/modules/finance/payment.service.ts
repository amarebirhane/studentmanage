import axios from 'axios';
import { prisma } from '../../config';
import { ApiError } from '../../middlewares/error.middleware';

const CHAPA_URL = 'https://api.chapa.co/v1/transaction';
const CHAPA_KEY = process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-xxxxxxxxxxxxxxxx'; // Use env var in prod

export class PaymentService {
    static async initializePayment(
        data: {
            amount: number;
            email: string;
            firstName: string;
            lastName: string;
            invoiceId?: string;
            userId: string;
            schoolId: string;
            callbackUrl?: string; // Optional custom callback
            studentId: string;
        }
    ) {
        // Create unique tx_ref
        const txRef = `TX-${Date.now()}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

        // 1. Create Transaction Record in DB (Pending)
        await prisma.paymentTransaction.create({
            data: {
                txRef,
                amount: data.amount,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                studentId: data.studentId,
                invoiceId: data.invoiceId,
                schoolId: data.schoolId,
                status: 'PENDING',
                gateway: 'CHAPA'
            }
        });

        // 2. Call Chapa API
        try {
            const response = await axios.post(
                `${CHAPA_URL}/initialize`,
                {
                    amount: data.amount,
                    currency: 'ETB',
                    email: data.email,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    tx_ref: txRef,
                    callback_url: data.callbackUrl || `https://your-domain.com/api/v1/finance/payments/verify/${txRef}`,
                    return_url: `http://localhost:3000/dashboard/fees/payment-success`, // Redirect frontend here
                    customization: {
                        title: 'School Fee Payment',
                        description: 'Payment for school fees'
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${CHAPA_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data; // Contains checkout_url
        } catch (error: any) {
            console.error('Chapa Init Error:', error.response?.data || error.message);
            // Update DB to failed if init fails
            await prisma.paymentTransaction.update({
                where: { txRef },
                data: { status: 'FAILED' }
            });
            throw new ApiError(502, 'Payment Gateway Error');
        }
    }

    static async verifyPayment(txRef: string) {
        try {
            const response = await axios.get(`${CHAPA_URL}/verify/${txRef}`, {
                headers: {
                    Authorization: `Bearer ${CHAPA_KEY}`
                }
            });

            const status = response.data.status; // 'success' or 'failed'

            if (status === 'success') {
                // Update DB
                const tx = await prisma.paymentTransaction.update({
                    where: { txRef },
                    data: { status: 'SUCCESS' },
                    include: { invoice: true }
                });

                // Update Invoice Status if linked
                if (tx.invoiceId) {
                    await prisma.feeInvoice.update({
                        where: { id: tx.invoiceId },
                        data: { status: 'PAID' }
                    });

                    // Add Payment Record to FeePayment table for invoice tracking
                    await prisma.feePayment.create({
                        data: {
                            invoiceId: tx.invoiceId,
                            amount: tx.amount,
                            method: 'CHAPA',
                            reference: txRef,
                            schoolId: tx.schoolId
                        }
                    });
                }
                return { success: true, message: 'Payment verified successfully' };
            } else {
                await prisma.paymentTransaction.update({
                    where: { txRef },
                    data: { status: 'FAILED' }
                });
                return { success: false, message: 'Payment verification failed' };
            }
        } catch (error: any) {
            console.error('Chapa Verify Error:', error.response?.data || error.message);
            // Don't fail immediately, might be network issue.
            // Manual verify might be needed.
            throw new ApiError(502, 'Verification Failed');
        }
    }

    static async getTransactions(schoolId: string) {
        return prisma.paymentTransaction.findMany({
            where: { schoolId },
            orderBy: { createdAt: 'desc' },
            include: {
                student: {
                    select: {
                        user: {
                            select: { firstName: true, lastName: true, email: true }
                        }
                    }
                },
                invoice: { select: { description: true } }
            }
        });
    }
}
