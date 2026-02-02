"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllTeachers = exports.deleteTeacher = exports.updateTeacher = exports.findTeacherByUserId = exports.findTeacherById = exports.createTeacher = void 0;
const config_1 = require("../../config");
const createTeacher = async (data) => {
    return config_1.prisma.teacherProfile.create({
        data,
    });
};
exports.createTeacher = createTeacher;
const findTeacherById = async (id) => {
    return config_1.prisma.teacherProfile.findUnique({
        where: { id },
        include: {
            user: true,
            sections: true,
        },
    });
};
exports.findTeacherById = findTeacherById;
const findTeacherByUserId = async (userId) => {
    return config_1.prisma.teacherProfile.findUnique({
        where: { userId },
    });
};
exports.findTeacherByUserId = findTeacherByUserId;
const updateTeacher = async (id, data) => {
    return config_1.prisma.teacherProfile.update({
        where: { id },
        data,
    });
};
exports.updateTeacher = updateTeacher;
const deleteTeacher = async (id) => {
    return config_1.prisma.teacherProfile.delete({
        where: { id },
    });
};
exports.deleteTeacher = deleteTeacher;
const findAllTeachers = async (params) => {
    const { skip, take, where } = params;
    return config_1.prisma.teacherProfile.findMany({
        skip,
        take,
        where,
        include: {
            user: true,
            sections: true
        }
    });
};
exports.findAllTeachers = findAllTeachers;
