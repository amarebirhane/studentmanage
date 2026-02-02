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
exports.getAllExams = exports.deleteExam = exports.updateExam = exports.getExamById = exports.createExam = void 0;
const examRepository = __importStar(require("./exam.repository"));
const apiResponse_1 = require("../../utils/apiResponse");
const createExam = async (data) => {
    return examRepository.createExam(data);
};
exports.createExam = createExam;
const getExamById = async (id) => {
    const exam = await examRepository.findExamById(id);
    if (!exam) {
        throw new apiResponse_1.ApiError(404, 'Exam not found');
    }
    return exam;
};
exports.getExamById = getExamById;
const updateExam = async (id, data) => {
    const exam = await examRepository.findExamById(id);
    if (!exam) {
        throw new apiResponse_1.ApiError(404, 'Exam not found');
    }
    return examRepository.updateExam(id, data);
};
exports.updateExam = updateExam;
const deleteExam = async (id) => {
    const exam = await examRepository.findExamById(id);
    if (!exam) {
        throw new apiResponse_1.ApiError(404, 'Exam not found');
    }
    return examRepository.deleteExam(id);
};
exports.deleteExam = deleteExam;
const getAllExams = async (filters = {}) => {
    return examRepository.findAllExams({ where: filters });
};
exports.getAllExams = getAllExams;
