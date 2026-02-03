import api from '@/lib/api';

const ENDPOINT = '/teachers';

export const teacherService = {
    async getTeachers(params?: any) {
        const { data } = await api.get(ENDPOINT, { params });
        return data.data;
    },
    async getTeacherById(id: string) {
        const { data } = await api.get(`${ENDPOINT}/${id}`);
        return data.data;
    },
    async createTeacher(teacherData: any) {
        const { data } = await api.post(ENDPOINT, teacherData);
        return data.data;
    },
    async updateTeacher(id: string, teacherData: any) {
        const { data } = await api.put(`${ENDPOINT}/${id}`, teacherData);
        return data.data;
    },
    async deleteTeacher(id: string) {
        await api.delete(`${ENDPOINT}/${id}`);
    },
    async getTeacherClasses() {
        const { data } = await api.get(`${ENDPOINT}/my-classes`);
        return data.data;
    },
    async getTeacherDashboardStats() {
        const { data } = await api.get(`${ENDPOINT}/dashboard`);
        return data.data;
    }
};
