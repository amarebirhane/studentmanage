import { Class, Prisma } from '@prisma/client';
import { prisma } from '../../config';

export const createClass = async (data: Prisma.ClassCreateInput): Promise<Class> => {
    return prisma.class.create({
        data,
    });
};

export const findClassById = async (id: string): Promise<Class | null> => {
    return prisma.class.findUnique({
        where: { id },
        include: {
            sections: true
        }
    });
};

export const updateClass = async (id: string, data: Prisma.ClassUpdateInput): Promise<Class> => {
    return prisma.class.update({
        where: { id },
        data,
    });
};

export const deleteClass = async (id: string): Promise<Class> => {
    return prisma.class.delete({
        where: { id },
    });
};

export const findAllClasses = async (): Promise<Class[]> => {
    return prisma.class.findMany({
        include: {
            sections: true
        }
    });
};
