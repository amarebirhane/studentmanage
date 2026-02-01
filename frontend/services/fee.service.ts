import api from '@/lib/api';

const ENDPOINT = '/fees';

export const feeService = {
    async getFees(params?: any) {
        const { data } = await api.get(ENDPOINT, { params });
        return data.data;
    },
    async createFee(data: any) {
        const response = await api.post(ENDPOINT, data);
        return response.data.data;
    },
    async getFeeById(id: string) {
        const { data } = await api.get(`${ENDPOINT}/${id}`);
        return data.data;
    },
};
