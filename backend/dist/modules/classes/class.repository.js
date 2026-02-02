"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllClasses = exports.deleteClass = exports.updateClass = exports.findClassById = exports.createClass = void 0;
const config_1 = require("../../config");
const createClass = async (data) => {
    return config_1.prisma.class.create({
        data,
    });
};
exports.createClass = createClass;
const findClassById = async (id) => {
    return config_1.prisma.class.findUnique({
        where: { id },
        include: {
            sections: true
        }
    });
};
exports.findClassById = findClassById;
const updateClass = async (id, data) => {
    return config_1.prisma.class.update({
        where: { id },
        data,
    });
};
exports.updateClass = updateClass;
const deleteClass = async (id) => {
    return config_1.prisma.class.delete({
        where: { id },
    });
};
exports.deleteClass = deleteClass;
const findAllClasses = async () => {
    return config_1.prisma.class.findMany({
        include: {
            sections: true
        }
    });
};
exports.findAllClasses = findAllClasses;
