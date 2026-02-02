import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

const ENDPOINT = '/parents';

export const parentService = {
    async getParents() {
        const { data } = await api.get<ApiResponse<any[]>>(ENDPOINT);
        return data.data;
    },
    async getParentById(id: string) {
        const { data } = await api.get<ApiResponse<any>>(`${ENDPOINT}/${id}`);
        return data.data;
    },
    async createParent(parentData: any) {
        const { data } = await api.post<ApiResponse<any>>(ENDPOINT, parentData);
        return data.data;
    },
    async updateParent(id: string, parentData: any) {
        const { data } = await api.put<ApiResponse<any>>(`${ENDPOINT}/${id}`, parentData);
        return data.data;
    },
    async deleteParent(id: string) {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};
