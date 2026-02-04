import api from '@/lib/api';
import { User, UserRole } from '@/types/user';

export const userService = {
    getUsers: async () => {
        const response = await api.get('/admin');
        return response.data.data as User[];
    },

    getUserById: async (id: string) => {
        const response = await api.get(`/admin/${id}`);
        return response.data.data as User;
    },

    updateUser: async (id: string, data: Partial<User>) => {
        const response = await api.put(`/admin/${id}`, data);
        return response.data.data as User;
    },

    deleteUser: async (id: string) => {
        const response = await api.delete(`/admin/${id}`);
        return response.data;
    },

    searchUsers: async (query: string) => {
        const response = await api.get(`/admin/search?q=${query}`);
        return response.data.data as User[];
    },

    registerUser: async (data: any) => {
        // Registration is handled by the auth module's register endpoint but with admin privileges
        const response = await api.post('/auth/register', data);
        return response.data.data;
    }
};
