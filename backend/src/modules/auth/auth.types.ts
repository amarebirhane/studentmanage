import { User } from '@prisma/client';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'ACCOUNTANT' | 'STAFF';

export interface AuthResponse {
    user: Partial<User>;
    token: string;
}

export interface AuthenticatedRequest extends Request {
    user?: User;
}
