import { User } from '@prisma/client';

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface AuthResponse {
    user: Partial<User>;
    token: string;
}

export interface AuthenticatedRequest extends Request {
    user?: User;
}
