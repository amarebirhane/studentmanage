"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentSchema = exports.createStudentSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createStudentSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2),
    lastName: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    dateOfBirth: zod_1.z.string().optional(), // Expecting ISO date string
    gender: zod_1.z.nativeEnum(client_1.Gender).optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    classId: zod_1.z.string().optional(),
    sectionId: zod_1.z.string().optional(),
    guardianName: zod_1.z.string().optional(),
    guardianPhone: zod_1.z.string().optional(),
    guardianEmail: zod_1.z.string().email().optional(),
});
exports.updateStudentSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2).optional(),
    lastName: zod_1.z.string().min(2).optional(),
    dateOfBirth: zod_1.z.string().optional(),
    gender: zod_1.z.nativeEnum(client_1.Gender).optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    classId: zod_1.z.string().optional(),
    sectionId: zod_1.z.string().optional(),
    guardianName: zod_1.z.string().optional(),
    guardianPhone: zod_1.z.string().optional(),
    guardianEmail: zod_1.z.string().email().optional(),
});
