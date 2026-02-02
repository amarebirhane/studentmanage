"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExam = exports.updateExam = exports.getMyResults = exports.publishResults = exports.enterMarks = exports.getExam = exports.getAllExams = exports.createExam = void 0;
const exam_service_1 = require("./exam.service");
const apiResponse_1 = require("../../utils/apiResponse");
const createExam = async (req, res, next) => {
    try {
        const exam = await exam_service_1.ExamService.createExam({
            ...req.body,
            createdById: req.user?.id,
            schoolId: req.schoolId,
        });
        new apiResponse_1.ApiResponse(res, 201, 'Exam created successfully', exam).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createExam = createExam;
const getAllExams = async (req, res, next) => {
    try {
        const filters = {
            ...req.query,
            schoolId: req.schoolId,
            teacherId: req.user?.role === 'TEACHER' ? req.user?.id : undefined,
        };
        const exams = await exam_service_1.ExamService.getExams(filters);
        new apiResponse_1.ApiResponse(res, 200, 'All exams', exams).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAllExams = getAllExams;
const getExam = async (req, res, next) => {
    try {
        const exam = await exam_service_1.ExamService.getExamById(req.params.id, req.schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Exam details', exam).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getExam = getExam;
const enterMarks = async (req, res, next) => {
    try {
        const results = await exam_service_1.ExamService.enterMarks({
            examId: req.params.id,
            marks: req.body.marks,
            schoolId: req.schoolId,
        });
        new apiResponse_1.ApiResponse(res, 200, 'Marks recorded successfully', results).send();
    }
    catch (error) {
        next(error);
    }
};
exports.enterMarks = enterMarks;
const publishResults = async (req, res, next) => {
    try {
        const exam = await exam_service_1.ExamService.publishResults(req.params.id, req.schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Results published successfully', exam).send();
    }
    catch (error) {
        next(error);
    }
};
exports.publishResults = publishResults;
const getMyResults = async (req, res, next) => {
    try {
        const studentProfile = await require('../../config').prisma.studentProfile.findFirst({
            where: {
                userId: req.user?.id,
                schoolId: req.schoolId
            }
        });
        if (!studentProfile) {
            return new apiResponse_1.ApiResponse(res, 404, 'Student profile not found').send();
        }
        const results = await exam_service_1.ExamService.getMyResults(studentProfile.id, {
            ...req.query,
            schoolId: req.schoolId
        });
        new apiResponse_1.ApiResponse(res, 200, 'My results', results).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getMyResults = getMyResults;
// Legacy exports
const updateExam = async (req, res, next) => {
    try {
        const exam = await exam_service_1.ExamService.updateExam(req.params.id, req.body, req.schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Exam updated successfully', exam).send();
    }
    catch (error) {
        next(error);
    }
};
exports.updateExam = updateExam;
const deleteExam = async (req, res, next) => {
    try {
        await exam_service_1.ExamService.deleteExam(req.params.id, req.schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Exam deleted successfully').send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteExam = deleteExam;
