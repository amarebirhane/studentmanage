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
    },

    async createExam(examData: any) {
        const { data } = await api.post<ApiResponse<any>>(ENDPOINT, examData);
        return data.data;
    },

    async updateExam(id: string, examData: any) {
        const { data } = await api.put<ApiResponse<any>>(`${ENDPOINT}/${id}`, examData);
        return data.data;
    },

    async deleteExam(id: string) {
        await api.delete(`${ENDPOINT}/${id}`);
    },

    async enterMarks(examId: string, marks: Array<{ studentId: string; scoredMarks: number; remarks?: string }>) {
        const { data } = await api.post<ApiResponse<any>>(`${ENDPOINT}/${examId}/marks`, { marks });
        return data.data;
    },

    async publishResults(examId: string) {
        const { data } = await api.post<ApiResponse<any>>(`${ENDPOINT}/${examId}/publish`);
        return data.data;
    }
};
