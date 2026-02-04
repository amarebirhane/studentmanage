import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

const ENDPOINT = '/notifications';

export const notificationService = {
    async getMyNotifications() {
        const { data } = await api.get<ApiResponse<any[]>>(ENDPOINT);
        return data.data || [];
    },
    async markAsRead(id: string) {
        const { data } = await api.patch<ApiResponse<any>>(`${ENDPOINT}/${id}/read`);
        return data.data;
    },
    async markAllAsRead() {
        const { data } = await api.patch<ApiResponse<any>>(`${ENDPOINT}/read-all`);
        return data.data;
    }
};
