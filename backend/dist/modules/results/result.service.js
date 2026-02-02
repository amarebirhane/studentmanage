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
exports.getAllResults = exports.deleteResult = exports.updateResult = exports.getResultById = exports.createResult = void 0;
const resultRepository = __importStar(require("./result.repository"));
const apiResponse_1 = require("../../utils/apiResponse");
const createResult = async (data) => {
    return resultRepository.createResult(data);
};
exports.createResult = createResult;
const getResultById = async (id) => {
    const result = await resultRepository.findResultById(id);
    if (!result) {
        throw new apiResponse_1.ApiError(404, 'Result not found');
    }
    return result;
};
exports.getResultById = getResultById;
const updateResult = async (id, data) => {
    const result = await resultRepository.findResultById(id);
    if (!result) {
        throw new apiResponse_1.ApiError(404, 'Result not found');
    }
    return resultRepository.updateResult(id, data);
};
exports.updateResult = updateResult;
const deleteResult = async (id) => {
    const result = await resultRepository.findResultById(id);
    if (!result) {
        throw new apiResponse_1.ApiError(404, 'Result not found');
    }
    return resultRepository.deleteResult(id);
};
exports.deleteResult = deleteResult;
const getAllResults = async (filters = {}) => {
    return resultRepository.findAllResults({ where: filters });
};
exports.getAllResults = getAllResults;
