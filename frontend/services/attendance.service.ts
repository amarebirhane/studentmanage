import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

const ENDPOINT = '/attendance';

export const attendanceService = {
    async getAttendance(params?: any) {
        const { data } = await api.get<ApiResponse<any[]>>(ENDPOINT, { params });
        return data.data;
    },
    async markAttendance(attendanceData: any) {
        const { data } = await api.post<ApiResponse<any>>(ENDPOINT, attendanceData);
        return data.data;
    },
    async bulkMarkAttendance(bulkData: {
        date: string;
        sectionId: string;
        records: Array<{
            studentId: string;
            status: string;
            remarks?: string;
        }>;
    }) {
        const { data } = await api.post<ApiResponse<any>>(`${ENDPOINT}/bulk`, bulkData);
        return data.data;
    },
    async getStudentAttendance(studentId: string) {
        const { data } = await api.get<ApiResponse<any>>(`${ENDPOINT}/?studentId=${studentId}`);
        return data.data;
    },
    async getAttendanceStats(studentId: string) {
        const { data } = await api.get<ApiResponse<any>>(`${ENDPOINT}/summary/${studentId}`);
        return data.data;
    },
    async getDailyReport(params: {
        date: string;
        sectionId?: string;
        classId?: string;
        periodNumber?: number;
    }) {
        const { data } = await api.get<ApiResponse<any>>(`${ENDPOINT}/report/daily`, { params });
        return data.data;
    }
};
