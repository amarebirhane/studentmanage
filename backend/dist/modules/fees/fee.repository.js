"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllFeeInvoices = exports.deleteFeeInvoice = exports.updateFeeInvoice = exports.findFeeInvoiceById = exports.createFeeInvoice = void 0;
const config_1 = require("../../config");
const createFeeInvoice = async (data) => {
    return config_1.prisma.feeInvoice.create({
        data,
    });
};
exports.createFeeInvoice = createFeeInvoice;
const findFeeInvoiceById = async (id) => {
    return config_1.prisma.feeInvoice.findUnique({
        where: { id },
        include: {
            student: {
                include: {
                    user: true
                }
            },
            payments: true,
        },
    });
};
exports.findFeeInvoiceById = findFeeInvoiceById;
const updateFeeInvoice = async (id, data) => {
    return config_1.prisma.feeInvoice.update({
        where: { id },
        data,
    });
};
exports.updateFeeInvoice = updateFeeInvoice;
const deleteFeeInvoice = async (id) => {
    return config_1.prisma.feeInvoice.delete({
        where: { id },
    });
};
exports.deleteFeeInvoice = deleteFeeInvoice;
const findAllFeeInvoices = async (params) => {
    const { where } = params;
    return config_1.prisma.feeInvoice.findMany({
        where,
        include: {
            student: {
                include: {
                    user: true
                }
            },
            payments: true
        }
    });
};
exports.findAllFeeInvoices = findAllFeeInvoices;
