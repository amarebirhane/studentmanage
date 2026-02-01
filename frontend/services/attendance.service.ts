import api from '@/lib/api';

const ENDPOINT = '/attendance';

export const attendanceService = {
    async getAttendance(params?: any) {
        const { data } = await api.get(ENDPOINT, { params });
        return data.data;
    },
    async markAttendance(data: any) {
        const response = await api.post(ENDPOINT, data);
        return response.data.data;
    },
    async getStudentAttendance(studentId: string) {
        const { data } = await api.get(`${ENDPOINT}/student/${studentId}`);
        return data.data;
    },
};
