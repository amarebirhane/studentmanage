import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

const ENDPOINT = '/fees';

export const feeService = {
    async getFees(params?: any) {
        const { data } = await api.get<ApiResponse<any[]>>(ENDPOINT, { params });
        return data.data;
    },
    async createFee(data: any) {
        const { data: response } = await api.post<ApiResponse<any>>(ENDPOINT, data);
        return response.data;
    },
    async getFeeById(id: string) {
        const { data } = await api.get<ApiResponse<any>>(`${ENDPOINT}/${id}`);
        return data.data;
    },
    async recordPayment(invoiceId: string, paymentData: { amount: number; method?: string; reference?: string }) {
        const { data } = await api.post<ApiResponse<any>>(`${ENDPOINT}/${invoiceId}/payments`, paymentData);
        return data.data;
    },
    async deleteFee(id: string) {
        await api.delete(`${ENDPOINT}/${id}`);
    }
};
