import { School, Prisma } from '@prisma/client';
import { prisma } from '../../config';

export const createSchool = async (data: Prisma.SchoolCreateInput): Promise<School> => {
    return prisma.school.create({
        data,
    });
};

export const findSchoolById = async (id: string): Promise<School | null> => {
    return prisma.school.findUnique({
        where: { id },
    });
};

export const updateSchool = async (id: string, data: Prisma.SchoolUpdateInput): Promise<School> => {
    return prisma.school.update({
        where: { id },
        data,
    });
};

export const deleteSchool = async (id: string): Promise<School> => {
    return prisma.school.delete({
        where: { id },
    });
};

export const findAllSchools = async (): Promise<School[]> => {
    return prisma.school.findMany();
};
