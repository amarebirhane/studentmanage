import { User } from './user';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface StudentProfile {
    id: string;
    userId: string;
    user?: User;
    enrollmentNo?: string;
    age?: number;
    gender?: Gender;
    dateOfBirth?: string;
    contactAddress?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
    classId?: string;
    class?: { id: string, name: string };
    sectionId?: string;
    section?: { id: string, name: string };
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface StudentFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    enrollmentNo?: string;
    age?: number;
    gender?: Gender;
    dateOfBirth?: string;
    contactAddress?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
    classId?: string;
    sectionId?: string;
    avatarUrl?: string;
}
