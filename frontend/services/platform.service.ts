import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

export interface PlatformStats {
    schools: number;
    users: number;
    students: number;
    teachers: number;
    totalRevenue: number;
    recentSchools: any[];
}

export interface PlatformAdmin {
    id: string;
    name: string;
    email: string;
    phone: string;
    school: string;
    status: string;
}

export const platformService = {
    async getStats(): Promise<PlatformStats> {
        const { data } = await api.get<ApiResponse<PlatformStats>>('/platform/stats');
        return data.data!;
    },

    async getAdmins(): Promise<PlatformAdmin[]> {
        const { data } = await api.get<ApiResponse<PlatformAdmin[]>>('/platform/admins');
        return data.data!;
    },

    async getSchools(): Promise<any[]> {
        const { data } = await api.get<ApiResponse<any[]>>('/platform/schools');
        return data.data!;
    },

    async getLogs(params?: any): Promise<any> {
        const { data } = await api.get<ApiResponse<any>>('/platform/logs', { params });
        return data.data!;
    },

    async assignAdmin(payload: { email?: string; userId?: string; schoolId: string }): Promise<void> {
        await api.post('/platform/assign-admin', payload);
    }
};
