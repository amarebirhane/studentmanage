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
exports.getAllResults = exports.deleteResult = exports.updateResult = exports.getResult = exports.createResult = void 0;
const resultService = __importStar(require("./result.service"));
const apiResponse_1 = require("../../utils/apiResponse");
const createResult = async (req, res, next) => {
    try {
        const result = await resultService.createResult(req.body);
        new apiResponse_1.ApiResponse(res, 201, 'Result created successfully', result).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createResult = createResult;
const getResult = async (req, res, next) => {
    try {
        const result = await resultService.getResultById(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'Result details', result).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getResult = getResult;
const updateResult = async (req, res, next) => {
    try {
        const result = await resultService.updateResult(req.params.id, req.body);
        new apiResponse_1.ApiResponse(res, 200, 'Result updated successfully', result).send();
    }
    catch (error) {
        next(error);
    }
};
exports.updateResult = updateResult;
const deleteResult = async (req, res, next) => {
    try {
        await resultService.deleteResult(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'Result deleted successfully').send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteResult = deleteResult;
const getAllResults = async (req, res, next) => {
    try {
        const results = await resultService.getAllResults(req.query);
        new apiResponse_1.ApiResponse(res, 200, 'All results', results).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAllResults = getAllResults;
