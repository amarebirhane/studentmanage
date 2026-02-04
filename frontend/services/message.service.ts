import api from '@/lib/api';

export const messageService = {
    getMessages: async () => {
        const response = await api.get('/messages');
        return response.data.data;
    },

    getSentMessages: async () => {
        const response = await api.get('/messages/sent');
        return response.data.data;
    },

    sendMessage: async (data: { recipientId: string; subject: string; content: string }) => {
        const response = await api.post('/messages', data);
        return response.data.data;
    },

    markAsRead: async (id: string) => {
        const response = await api.patch(`/messages/${id}/read`);
        return response.data.data;
    },

    deleteMessage: async (id: string) => {
        const response = await api.delete(`/messages/${id}`);
        return response.data;
    }
};
