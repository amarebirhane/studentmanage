import * as schoolRepository from './school.repository';
import { Prisma } from '@prisma/client';
import { ApiError } from '../../utils/apiResponse';

export const createSchool = async (data: Prisma.SchoolCreateInput) => {
    return schoolRepository.createSchool(data);
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
