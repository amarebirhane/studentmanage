"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countUsers = exports.findAllUsers = exports.deleteUser = exports.updateUser = exports.createUser = exports.findUserById = exports.findUserByEmail = void 0;
const config_1 = require("../../config");
const findUserByEmail = async (email) => {
    return config_1.prisma.user.findUnique({
        where: { email },
    });
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    return config_1.prisma.user.findUnique({
        where: { id },
    });
};
exports.findUserById = findUserById;
const createUser = async (data) => {
    return config_1.prisma.user.create({
        data,
    });
};
exports.createUser = createUser;
const updateUser = async (id, data) => {
    return config_1.prisma.user.update({
        where: { id },
        data,
    });
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    return config_1.prisma.user.delete({
        where: { id },
    });
};
exports.deleteUser = deleteUser;
const findAllUsers = async (params) => {
    const { skip, take, where, orderBy } = params;
    return config_1.prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
    });
};
exports.findAllUsers = findAllUsers;
const countUsers = async (where) => {
    return config_1.prisma.user.count({
        where,
    });
};
exports.countUsers = countUsers;
