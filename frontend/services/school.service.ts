import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

export interface School {
    id: string;
    name: string;
    slug: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    isSuspended: boolean;
    createdAt: string;
    _count?: {
        students: number;
        teachers: number;
    };
}

export interface CreateSchoolData {
    name: string;
    slug: string;
    address: string;
    phone: string;
    email: string;
    adminUser: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    };
}

export const schoolService = {
    async getAllSchools(): Promise<School[]> {
        const { data } = await api.get<ApiResponse<School[]>>('/schools');
        return data.data || [];
    },

    async getSchoolById(id: string): Promise<School> {
        const { data } = await api.get<ApiResponse<School>>(`/schools/${id}`);
        return data.data!;
    },

    async createSchool(data: CreateSchoolData): Promise<School> {
        const { data: response } = await api.post<ApiResponse<School>>('/schools', data);
        return response.data!;
    },

    async updateSchool(id: string, data: Partial<School>): Promise<School> {
        const { data: response } = await api.put<ApiResponse<School>>(`/schools/${id}`, data);
        return response.data!;
    },

    async deleteSchool(id: string): Promise<void> {
        await api.delete(`/schools/${id}`);
    }
};
