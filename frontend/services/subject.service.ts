import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

const ENDPOINT = '/classes/subjects';

export const subjectService = {
    async getSubjects(params?: any) {
        const { data } = await api.get<ApiResponse<any[]>>(ENDPOINT, { params });
        return data.data;
    },

    async createSubject(subjectData: any) {
        const { data } = await api.post<ApiResponse<any>>(ENDPOINT, subjectData);
        return data.data;
    },

    async deleteSubject(id: string) {
        await api.delete(`${ENDPOINT}/${id}`);
    }
};
