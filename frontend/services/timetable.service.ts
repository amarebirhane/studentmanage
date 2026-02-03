import api from '@/lib/api';

export const timetableService = {
    getTimetable: async (params?: { classId?: string; sectionId?: string }) => {
        const response = await api.get('/timetables', { params });
        return response.data.data;
    },

    getMyTimetable: async () => {
        const response = await api.get('/timetables/my-timetable');
        return response.data.data;
    },

    createEntry: async (data: any) => {
        const response = await api.post('/timetables', data);
        return response.data.data;
    },

    updateEntry: async (id: string, data: any) => {
        const response = await api.put(`/timetables/${id}`, data);
        return response.data.data;
    },

    deleteEntry: async (id: string) => {
        const response = await api.delete(`/timetables/${id}`);
        return response.data;
    }
};
