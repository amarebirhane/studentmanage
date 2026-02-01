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
