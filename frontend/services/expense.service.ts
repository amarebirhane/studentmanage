import api from '@/lib/api';

export interface Expense {
    id: string;
    amount: number;
    category: string;
    description?: string;
    date: string;
    status: string;
    recordedBy?: {
        firstName: string;
        lastName: string;
    };
    createdAt: string;
}

export const expenseService = {
    getAll: async (filters?: any) => {
        const response = await api.get('/finance/expenses', { params: filters });
        return response.data.data;
    },

    getSummary: async () => {
        const response = await api.get('/finance/expenses/summary');
        return response.data.data;
    },

    create: async (data: any) => {
        const response = await api.post('/finance/expenses', data);
        return response.data.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.put(`/finance/expenses/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/finance/expenses/${id}`);
        return response.data.data;
    }
};
