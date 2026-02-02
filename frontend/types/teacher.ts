import { User } from './user';

export interface TeacherProfile {
    id: string;
    userId: string;
    user?: User;
    employeeId: string;
    specialization: string;
    qualification: string;
    experience: number;
    joiningDate: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TeacherFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    employeeId: string;
    specialization: string;
    qualification: string;
    experience: number;
    joiningDate: string;
    avatarUrl?: string;
}
