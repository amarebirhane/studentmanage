import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

const ENDPOINT = '/exams';

export const examService = {
    async getExams(params?: any) {
        const { data } = await api.get<ApiResponse<any[]>>(ENDPOINT, { params });
        return data.data;
    },
    async getExamById(id: string) {
        const { data } = await api.get<ApiResponse<any>>(`${ENDPOINT}/${id}`);
        return data.data;
    }
};
