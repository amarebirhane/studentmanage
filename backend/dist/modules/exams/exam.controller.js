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
exports.getAllExams = exports.deleteExam = exports.updateExam = exports.getExam = exports.createExam = void 0;
const examService = __importStar(require("./exam.service"));
const apiResponse_1 = require("../../utils/apiResponse");
const createExam = async (req, res, next) => {
    try {
        const exam = await examService.createExam(req.body);
        new apiResponse_1.ApiResponse(res, 201, 'Exam created successfully', exam).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createExam = createExam;
const getExam = async (req, res, next) => {
    try {
        const exam = await examService.getExamById(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'Exam details', exam).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getExam = getExam;
const updateExam = async (req, res, next) => {
    try {
        const exam = await examService.updateExam(req.params.id, req.body);
        new apiResponse_1.ApiResponse(res, 200, 'Exam updated successfully', exam).send();
    }
    catch (error) {
        next(error);
    }
};
exports.updateExam = updateExam;
const deleteExam = async (req, res, next) => {
    try {
        await examService.deleteExam(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'Exam deleted successfully').send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteExam = deleteExam;
const getAllExams = async (req, res, next) => {
    try {
        const exams = await examService.getAllExams(req.query);
        new apiResponse_1.ApiResponse(res, 200, 'All exams', exams).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAllExams = getAllExams;
