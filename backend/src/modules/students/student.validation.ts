import { z } from 'zod';
import { Gender } from '@prisma/client';

export const createStudentSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    dateOfBirth: z.string().optional(), // Expecting ISO date string
    gender: z.nativeEnum(Gender).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    classId: z.string().optional(),
    sectionId: z.string().optional(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
    guardianEmail: z.string().email().optional(),
});

export const updateStudentSchema = z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    dateOfBirth: z.string().optional(),
    gender: z.nativeEnum(Gender).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    classId: z.string().optional(),
    sectionId: z.string().optional(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
    guardianEmail: z.string().email().optional(),
});
