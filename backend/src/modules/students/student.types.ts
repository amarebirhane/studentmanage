import { StudentProfile, User } from '@prisma/client';

export interface Student extends StudentProfile {
    user: Partial<User>;
}

export interface StudentFilters {
    search?: string;
    classId?: string;
    sectionId?: string;
    page?: number;
    limit?: number;
}
