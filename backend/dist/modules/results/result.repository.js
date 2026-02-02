"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllResults = exports.deleteResult = exports.updateResult = exports.findResultById = exports.createResult = void 0;
const config_1 = require("../../config");
const createResult = async (data) => {
    return config_1.prisma.gradeRecord.create({
        data,
    });
};
exports.createResult = createResult;
const findResultById = async (id) => {
    return config_1.prisma.gradeRecord.findUnique({
        where: { id },
        include: {
            student: {
                include: {
                    user: true
                }
            },
            exam: true,
        },
    });
};
exports.findResultById = findResultById;
const updateResult = async (id, data) => {
    return config_1.prisma.gradeRecord.update({
        where: { id },
        data,
    });
};
exports.updateResult = updateResult;
const deleteResult = async (id) => {
    return config_1.prisma.gradeRecord.delete({
        where: { id },
    });
};
exports.deleteResult = deleteResult;
const findAllResults = async (params) => {
    const { where } = params;
    return config_1.prisma.gradeRecord.findMany({
        where,
        include: {
            student: {
                include: {
                    user: true
                }
            },
            exam: true
        }
    });
};
exports.findAllResults = findAllResults;
