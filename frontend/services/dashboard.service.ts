import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

export interface SchoolAdminData {
    stats: {
        totalStudents: number;
        totalTeachers: number;
        totalClasses: number;
        totalRevenue: number;
        pendingFeesCount: number;
        todayAttendance: number;
    };
}

export interface TeacherData {
    stats: {
        managedClasses: number;
        taughtSubjects: number;
        activeAssignments: number;
    };
    upcomingExams: any[]; // Define Exam type properly if possible
}

export const dashboardService = {
    async getDashboardStats<T = SchoolAdminData | TeacherData>(): Promise<T> {
        const { data } = await api.get<ApiResponse<T>>('/dashboard');
        return data.data!;
    },
};
