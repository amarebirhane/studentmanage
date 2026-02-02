"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFeeInvoices = exports.deleteFeeInvoice = exports.updateFeeInvoice = exports.getFeeInvoiceById = exports.applyDiscountAndScholarship = exports.createFeeInvoice = void 0;
const feeRepository = __importStar(require("./fee.repository"));
const apiResponse_1 = require("../../utils/apiResponse");
const createFeeInvoice = async (data, schoolId) => {
    return feeRepository.createFeeInvoice({
        ...data,
        discount: data.discount || 0,
        scholarship: data.scholarship || 0,
        school: schoolId ? { connect: { id: schoolId } } : undefined
    });
};
exports.createFeeInvoice = createFeeInvoice;
const applyDiscountAndScholarship = async (id, data, schoolId) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice || (schoolId && feeInvoice.schoolId !== schoolId)) {
        throw new apiResponse_1.ApiError(404, 'Fee invoice not found');
    }
    return feeRepository.updateFeeInvoice(id, data);
};
exports.applyDiscountAndScholarship = applyDiscountAndScholarship;
const getFeeInvoiceById = async (id) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice) {
        throw new apiResponse_1.ApiError(404, 'Fee invoice not found');
    }
    return feeInvoice;
};
exports.getFeeInvoiceById = getFeeInvoiceById;
const updateFeeInvoice = async (id, data, schoolId) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice || (schoolId && feeInvoice.schoolId !== schoolId)) {
        throw new apiResponse_1.ApiError(404, 'Fee invoice not found');
    }
    return feeRepository.updateFeeInvoice(id, data);
};
exports.updateFeeInvoice = updateFeeInvoice;
const deleteFeeInvoice = async (id) => {
    const feeInvoice = await feeRepository.findFeeInvoiceById(id);
    if (!feeInvoice) {
        throw new apiResponse_1.ApiError(404, 'Fee invoice not found');
    }
    return feeRepository.deleteFeeInvoice(id);
};
exports.deleteFeeInvoice = deleteFeeInvoice;
const getAllFeeInvoices = async (filters = {}, schoolId, userId, role) => {
    const where = { ...filters };
    if (schoolId)
        where.schoolId = schoolId;
    // Role-based filtering
    if (role === 'STUDENT' && userId) {
        where.student = { userId };
    }
    else if (role === 'PARENT' && userId) {
        where.student = { parentProfiles: { some: { userId } } };
    }
    return feeRepository.findAllFeeInvoices({ where });
};
exports.getAllFeeInvoices = getAllFeeInvoices;
