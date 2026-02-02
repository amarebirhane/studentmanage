"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllSchools = exports.deleteSchool = exports.updateSchool = exports.findSchoolById = exports.createSchool = void 0;
const config_1 = require("../../config");
const createSchool = async (data) => {
    return config_1.prisma.school.create({
        data,
    });
};
exports.createSchool = createSchool;
const findSchoolById = async (id) => {
    return config_1.prisma.school.findUnique({
        where: { id },
    });
};
exports.findSchoolById = findSchoolById;
const updateSchool = async (id, data) => {
    return config_1.prisma.school.update({
        where: { id },
        data,
    });
};
exports.updateSchool = updateSchool;
const deleteSchool = async (id) => {
    return config_1.prisma.school.delete({
        where: { id },
    });
};
exports.deleteSchool = deleteSchool;
const findAllSchools = async () => {
    return config_1.prisma.school.findMany();
};
exports.findAllSchools = findAllSchools;
