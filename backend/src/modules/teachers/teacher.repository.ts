import { PrismaClient, TeacherProfile, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createTeacher = async (data: Prisma.TeacherProfileCreateInput): Promise<TeacherProfile> => {
    return prisma.teacherProfile.create({
        data,
    });
};

export const findTeacherById = async (id: string): Promise<TeacherProfile | null> => {
    return prisma.teacherProfile.findUnique({
        where: { id },
        include: {
            user: true,
            sections: true,
        },
    });
};

export const findTeacherByUserId = async (userId: string): Promise<TeacherProfile | null> => {
    return prisma.teacherProfile.findUnique({
        where: { userId },
    });
};

export const updateTeacher = async (id: string, data: Prisma.TeacherProfileUpdateInput): Promise<TeacherProfile> => {
    return prisma.teacherProfile.update({
        where: { id },
        data,
    });
};

export const deleteTeacher = async (id: string): Promise<TeacherProfile> => {
    return prisma.teacherProfile.delete({
        where: { id },
    });
};

export const findAllTeachers = async (params: {
    skip?: number;
    take?: number;
    where?: Prisma.TeacherProfileWhereInput;
}): Promise<TeacherProfile[]> => {
    const { skip, take, where } = params;
    return prisma.teacherProfile.findMany({
        skip,
        take,
        where,
        include: {
            user: true,
            sections: true
        }
    });
};
