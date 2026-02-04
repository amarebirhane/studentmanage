export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'ACCOUNTANT' | 'STAFF';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    phone?: string;
    avatarUrl?: string;
    schoolId?: string;
    createdAt: string;
    updatedAt: string;
}

export type AuthResponse = {
    user: User;
    token: string;
    refreshToken?: string;
} | (User & { token: string; refreshToken?: string; });

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
}
