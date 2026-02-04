import api from '@/lib/api';

export interface PaymentTransaction {
    id: string;
    txRef: string;
    amount: number;
    currency: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    gateway: string;
    createdAt: string;
    invoice?: {
        description: string;
    };
}

export const paymentService = {
    initializePayment: async (data: {
        amount: number;
        invoiceId?: string;
        studentId?: string; // Optional if backend infers
        email?: string;
        firstName?: string;
        lastName?: string;
    }) => {
        const response = await api.post('/finance/payments/initialize', data);
        return response.data.data; // Should contain checkout_url
    },

    verifyPayment: async (txRef: string) => {
        const response = await api.get(`/finance/payments/verify/${txRef}`);
        return response.data.data;
    },

    getMyTransactions: async () => {
        const response = await api.get('/finance/payments');
        return response.data.data;
    }
};
