import api from '@/lib/api';

export const announcementService = {
    getAnnouncements: async () => {
        const response = await api.get('/announcements');
        return response.data.data;
    },

    createAnnouncement: async (data: any) => {
        const response = await api.post('/announcements', data);
        return response.data.data;
    },

    updateAnnouncement: async (id: string, data: any) => {
        const response = await api.put(`/announcements/${id}`, data);
        return response.data.data;
    },

    deleteAnnouncement: async (id: string) => {
        const response = await api.delete(`/announcements/${id}`);
        return response.data;
    }
};
