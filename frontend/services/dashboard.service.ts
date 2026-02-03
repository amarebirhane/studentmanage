import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

export interface AdminStats {
    students: number;
    teachers: number;
    classes: number;
    parents: number;
    revenue: number;
}

export interface TeacherStats {
    activeClasses: number;
    totalStudents: number;
    upcomingExams: number;
    pendingAttendance: number;
}

export const dashboardService = {
    async getAdminStats(): Promise<AdminStats> {
        const { data } = await api.get<ApiResponse<AdminStats>>('/dashboard/admin/stats');
        return data.data!;
    },

    async getTeacherStats(): Promise<TeacherStats> {
        const { data } = await api.get<ApiResponse<TeacherStats>>('/dashboard/teacher/stats');
        return data.data!;
    },
};
