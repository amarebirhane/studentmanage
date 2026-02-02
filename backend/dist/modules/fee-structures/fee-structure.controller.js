"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkGenerateInvoices = exports.deleteFeeStructure = exports.updateFeeStructure = exports.getFeeStructureById = exports.getAllFeeStructures = exports.createFeeStructure = void 0;
const fee_structure_service_1 = require("./fee-structure.service");
const apiResponse_1 = require("../../utils/apiResponse");
const createFeeStructure = async (req, res, next) => {
    try {
        const feeStructure = await fee_structure_service_1.FeeStructureService.createFeeStructure({
            ...req.body,
            schoolId: req.schoolId,
        });
        new apiResponse_1.ApiResponse(res, 201, 'Fee structure created successfully', feeStructure).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createFeeStructure = createFeeStructure;
const getAllFeeStructures = async (req, res, next) => {
    try {
        const feeStructures = await fee_structure_service_1.FeeStructureService.getAllFeeStructures(req.schoolId, req.query.classId);
        new apiResponse_1.ApiResponse(res, 200, 'Fee structures retrieved', feeStructures).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAllFeeStructures = getAllFeeStructures;
const getFeeStructureById = async (req, res, next) => {
    try {
        const feeStructure = await fee_structure_service_1.FeeStructureService.getFeeStructureById(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'Fee structure details', feeStructure).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getFeeStructureById = getFeeStructureById;
const updateFeeStructure = async (req, res, next) => {
    try {
        const feeStructure = await fee_structure_service_1.FeeStructureService.updateFeeStructure(req.params.id, req.body, req.schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Fee structure updated successfully', feeStructure).send();
    }
    catch (error) {
        next(error);
    }
};
exports.updateFeeStructure = updateFeeStructure;
const deleteFeeStructure = async (req, res, next) => {
    try {
        await fee_structure_service_1.FeeStructureService.deleteFeeStructure(req.params.id, req.schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Fee structure deleted successfully').send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteFeeStructure = deleteFeeStructure;
const bulkGenerateInvoices = async (req, res, next) => {
    try {
        const invoices = await fee_structure_service_1.FeeStructureService.bulkGenerateInvoices({
            ...req.body,
            schoolId: req.schoolId,
        });
        new apiResponse_1.ApiResponse(res, 201, `${invoices.length} invoices generated successfully`, invoices).send();
    }
    catch (error) {
        next(error);
    }
};
exports.bulkGenerateInvoices = bulkGenerateInvoices;
