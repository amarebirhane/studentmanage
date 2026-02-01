import { User, Prisma } from '@prisma/client';
import { prisma } from '../../config';

export const findUserByEmail = async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
        where: { email },
    });
};

export const findUserById = async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({
        where: { id },
    });
};

export const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
    return prisma.user.create({
        data,
    });
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput): Promise<User> => {
    return prisma.user.update({
        where: { id },
        data,
    });
};

export const deleteUser = async (id: string): Promise<User> => {
    return prisma.user.delete({
        where: { id },
    });
};

export const findAllUsers = async (params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
}): Promise<User[]> => {
    const { skip, take, where, orderBy } = params;
    return prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
    });
};

export const countUsers = async (where?: Prisma.UserWhereInput): Promise<number> => {
    return prisma.user.count({
        where,
    });
};
