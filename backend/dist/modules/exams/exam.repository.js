"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllExams = exports.deleteExam = exports.updateExam = exports.findExamById = exports.createExam = void 0;
const config_1 = require("../../config");
const createExam = async (data) => {
    return config_1.prisma.exam.create({
        data,
    });
};
exports.createExam = createExam;
const findExamById = async (id) => {
    return config_1.prisma.exam.findUnique({
        where: { id },
        include: {
            class: true,
            section: true,
        },
    });
};
exports.findExamById = findExamById;
const updateExam = async (id, data) => {
    return config_1.prisma.exam.update({
        where: { id },
        data,
    });
};
exports.updateExam = updateExam;
const deleteExam = async (id) => {
    return config_1.prisma.exam.delete({
        where: { id },
    });
};
exports.deleteExam = deleteExam;
const findAllExams = async (params) => {
    const { where } = params;
    return config_1.prisma.exam.findMany({
        where,
        include: {
            class: true,
            section: true
        }
    });
};
exports.findAllExams = findAllExams;
