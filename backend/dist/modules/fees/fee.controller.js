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
exports.getAllFeeInvoices = exports.deleteFeeInvoice = exports.updateFeeInvoice = exports.getFeeInvoice = exports.createFeeInvoice = void 0;
const feeService = __importStar(require("./fee.service"));
const apiResponse_1 = require("../../utils/apiResponse");
const createFeeInvoice = async (req, res, next) => {
    try {
        const feeInvoice = await feeService.createFeeInvoice(req.body);
        new apiResponse_1.ApiResponse(res, 201, 'Fee invoice created successfully', feeInvoice).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createFeeInvoice = createFeeInvoice;
const getFeeInvoice = async (req, res, next) => {
    try {
        const feeInvoice = await feeService.getFeeInvoiceById(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'Fee invoice details', feeInvoice).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getFeeInvoice = getFeeInvoice;
const updateFeeInvoice = async (req, res, next) => {
    try {
        const feeInvoice = await feeService.updateFeeInvoice(req.params.id, req.body);
        new apiResponse_1.ApiResponse(res, 200, 'Fee invoice updated successfully', feeInvoice).send();
    }
    catch (error) {
        next(error);
    }
};
exports.updateFeeInvoice = updateFeeInvoice;
const deleteFeeInvoice = async (req, res, next) => {
    try {
        await feeService.deleteFeeInvoice(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'Fee invoice deleted successfully').send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteFeeInvoice = deleteFeeInvoice;
const getAllFeeInvoices = async (req, res, next) => {
    try {
        const feeInvoices = await feeService.getAllFeeInvoices(req.query);
        new apiResponse_1.ApiResponse(res, 200, 'All fee invoices', feeInvoices).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAllFeeInvoices = getAllFeeInvoices;
