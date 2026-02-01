import api from '@/lib/api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/user';
import { ApiResponse } from '@/types/api';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        return data.data!;
    },

    async register(registerData: RegisterData): Promise<User> {
        const { data } = await api.post<ApiResponse<User>>('/auth/register', registerData);
        return data.data!;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    async getProfile(): Promise<User> {
        const { data } = await api.get<ApiResponse<User>>('/auth/profile');
        return data.data!;
    },
};
