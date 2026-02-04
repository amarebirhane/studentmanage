import { prisma } from '../../config';
import { hashPassword } from '../../utils/password';
import { UserRole, Prisma } from '@prisma/client';
import { ApiError } from '../../utils/apiResponse';
import * as schoolRepository from './school.repository';

export const createSchool = async (data: any) => {
    const { adminUser, ...schoolData } = data;

    return prisma.$transaction(async (tx) => {
        // 1. Create the school
        const school = await tx.school.create({
            data: schoolData,
        });

        // 2. Create the admin user if provided
        if (adminUser) {
            const hashedPassword = await hashPassword(adminUser.password);
            await tx.user.create({
                data: {
                    firstName: adminUser.firstName,
                    lastName: adminUser.lastName,
                    email: adminUser.email,
                    password: hashedPassword,
                    role: UserRole.ADMIN,
                    schoolId: school.id,
                },
            });
        }

        return school;
    });
};

export const getSchoolById = async (id: string) => {
    const school = await schoolRepository.findSchoolById(id);
    if (!school) {
        throw new ApiError(404, 'School not found');
    }
    return school;
};

export const updateSchool = async (id: string, data: Prisma.SchoolUpdateInput) => {
    const school = await schoolRepository.findSchoolById(id);
    if (!school) {
        throw new ApiError(404, 'School not found');
    }
    return schoolRepository.updateSchool(id, data);
};

export const deleteSchool = async (id: string) => {
    const school = await schoolRepository.findSchoolById(id);
    if (!school) {
        throw new ApiError(404, 'School not found');
    }
    return schoolRepository.deleteSchool(id);
};

export const getAllSchools = async () => {
    return schoolRepository.findAllSchools();
};

export const setSuspensionStatus = async (id: string, isSuspended: boolean) => {
    return schoolRepository.updateSchool(id, { isSuspended });
};

export const configureAcademicYear = async (id: string, academicYear: string) => {
    return schoolRepository.updateSchool(id, { academicYear });
};

export const updateGradingSystem = async (id: string, gradingSystem: any) => {
    return schoolRepository.updateSchool(id, { gradingSystem });
};
