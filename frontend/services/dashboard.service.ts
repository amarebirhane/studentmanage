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
    recentActivity: {
        enrollments: any[];
        payments: any[];
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

export interface SuperAdminData {
    stats: {
        totalSchools: number;
        totalUsers: number;
        totalRevenue: number;
        activeSchools: number;
    };
    recentActivity: any[];
}

export const dashboardService = {
    async getDashboardStats<T = SchoolAdminData | TeacherData | SuperAdminData>(): Promise<T> {
        const { data } = await api.get<ApiResponse<T>>('/dashboard');
        return data.data!;
    },
};
