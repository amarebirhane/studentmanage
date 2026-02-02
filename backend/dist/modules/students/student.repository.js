"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countStudents = exports.findAllStudents = exports.deleteStudent = exports.updateStudent = exports.findStudentByUserId = exports.findStudentById = exports.createStudent = void 0;
const config_1 = require("../../config");
const createStudent = async (data) => {
    return config_1.prisma.studentProfile.create({
        data,
    });
};
exports.createStudent = createStudent;
const findStudentById = async (id) => {
    return config_1.prisma.studentProfile.findUnique({
        where: { id },
        include: {
            user: true,
            class: true,
            section: true,
        },
    });
};
exports.findStudentById = findStudentById;
const findStudentByUserId = async (userId) => {
    return config_1.prisma.studentProfile.findUnique({
        where: { userId },
    });
};
exports.findStudentByUserId = findStudentByUserId;
const updateStudent = async (id, data) => {
    return config_1.prisma.studentProfile.update({
        where: { id },
        data,
    });
};
exports.updateStudent = updateStudent;
const deleteStudent = async (id) => {
    return config_1.prisma.studentProfile.delete({
        where: { id },
    });
};
exports.deleteStudent = deleteStudent;
const findAllStudents = async (params) => {
    const { skip, take, where } = params;
    return config_1.prisma.studentProfile.findMany({
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
exports.findAllStudents = findAllStudents;
const countStudents = async (where) => {
    return config_1.prisma.studentProfile.count({ where });
};
exports.countStudents = countStudents;
