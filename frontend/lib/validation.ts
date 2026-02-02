import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']).optional(),
    phone: z.string().optional(),
});

export const studentSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    enrollmentNo: z.string().min(1, 'Enrollment number is required'),
    age: z.number().optional().or(z.string().transform(v => Number(v))),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    dateOfBirth: z.string().optional(),
    contactAddress: z.string().optional(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
    guardianEmail: z.string().optional(),
    classId: z.string().optional(),
    sectionId: z.string().optional(),
    avatarUrl: z.string().optional().nullable(),
});

export const updateStudentSchema = studentSchema.partial();

export const parentSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    phone: z.string().optional(),
    studentIds: z.array(z.string()).optional(),
    relationship: z.string().optional(),
});

export const updateParentSchema = parentSchema.partial();
