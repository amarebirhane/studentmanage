import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

const ENDPOINT = '/assignments';

export const assignmentService = {
    async getAssignments(params?: any) {
        const { data } = await api.get<ApiResponse<any[]>>(ENDPOINT, { params });
        return data.data;
    },

    async getAssignmentById(id: string) {
        const { data } = await api.get<ApiResponse<any>>(`${ENDPOINT}/${id}`);
        return data.data;
    },

    async createAssignment(assignmentData: any) {
        const { data } = await api.post<ApiResponse<any>>(ENDPOINT, assignmentData);
        return data.data;
    },

    async updateAssignment(id: string, assignmentData: any) {
        const { data } = await api.put<ApiResponse<any>>(`${ENDPOINT}/${id}`, assignmentData);
        return data.data;
    },

    async deleteAssignment(id: string) {
        await api.delete(`${ENDPOINT}/${id}`);
    },

    async getSubmissions(assignmentId: string) {
        const { data } = await api.get<ApiResponse<any[]>>(`${ENDPOINT}/${assignmentId}/submissions`);
        return data.data;
    },

    async gradeSubmission(submissionId: string, gradeData: { marks?: number; grade?: string; feedback?: string }) {
        const { data } = await api.post<ApiResponse<any>>(`${ENDPOINT}/submissions/${submissionId}/grade`, gradeData);
        return data.data;
    }
};
