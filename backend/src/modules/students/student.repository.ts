import { PrismaClient, StudentProfile, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createStudent = async (data: Prisma.StudentProfileCreateInput): Promise<StudentProfile> => {
    return prisma.studentProfile.create({
        data,
    });
};

export const findStudentById = async (id: string): Promise<StudentProfile | null> => {
    return prisma.studentProfile.findUnique({
        where: { id },
        include: {
            user: true,
            class: true,
            section: true,
        },
    });
};

export const findStudentByUserId = async (userId: string): Promise<StudentProfile | null> => {
    return prisma.studentProfile.findUnique({
        where: { userId },
    });
};

export const updateStudent = async (id: string, data: Prisma.StudentProfileUpdateInput): Promise<StudentProfile> => {
    return prisma.studentProfile.update({
        where: { id },
        data,
    });
};

export const deleteStudent = async (id: string): Promise<StudentProfile> => {
    return prisma.studentProfile.delete({
        where: { id },
    });
};

export const findAllStudents = async (params: {
    skip?: number;
    take?: number;
    where?: Prisma.StudentProfileWhereInput;
}): Promise<StudentProfile[]> => {
    const { skip, take, where } = params;
    return prisma.studentProfile.findMany({
        skip,
        take,
        where,
        include: {
            user: true,
            class: true,
            section: true
        }
    });
};

export const countStudents = async (where?: Prisma.StudentProfileWhereInput) => {
    return prisma.studentProfile.count({ where });
};
