import api from '@/lib/api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/user';
import { ApiResponse } from '@/types/api';

export const authService = {
    async login(credentials: LoginCredentials & { code?: string }): Promise<AuthResponse> {
        const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        console.log('AuthService.login - Raw API data.data:', data.data);
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

    async updateProfile(data: Partial<User>): Promise<User> {
        const { data: response } = await api.put<ApiResponse<User>>('/auth/profile', data);
        return response.data!;
    },

    async changePassword(data: any): Promise<void> {
        await api.patch('/auth/change-password', data);
    },
};
