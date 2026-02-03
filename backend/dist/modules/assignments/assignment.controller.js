"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignmentSubmissions = exports.getMySubmissions = exports.gradeSubmission = exports.submitAssignment = exports.getAssignments = exports.createAssignment = void 0;
const assignment_service_1 = require("./assignment.service");
const apiResponse_1 = require("../../utils/apiResponse");
const config_1 = require("../../config");
const createAssignment = async (req, res, next) => {
    try {
        const teacherProfile = await config_1.prisma.teacherProfile.findUnique({
            where: { userId: req.user?.id },
        });
        if (!teacherProfile) {
            return apiResponse_1.ApiResponse.error(res, 'Only teachers can create assignments', 403);
        }
        const assignment = await assignment_service_1.AssignmentService.createAssignment({
            ...req.body,
            teacherId: teacherProfile.id,
            userId: req.user?.id,
            schoolId: req.schoolId,
        });
        return apiResponse_1.ApiResponse.success(res, assignment, 'Assignment created successfully', 201);
    }
    catch (error) {
        next(error);
    }
};
exports.createAssignment = createAssignment;
const getAssignments = async (req, res, next) => {
    try {
        const assignments = await assignment_service_1.AssignmentService.getAssignments(req.query, req.schoolId, req.user?.id, req.user?.role);
        return apiResponse_1.ApiResponse.success(res, assignments, 'Assignments retrieved');
    }
    catch (error) {
        next(error);
    }
};
exports.getAssignments = getAssignments;
const submitAssignment = async (req, res, next) => {
    try {
        const studentProfile = await config_1.prisma.studentProfile.findUnique({
            where: { userId: req.user?.id },
        });
        if (!studentProfile) {
            return apiResponse_1.ApiResponse.error(res, 'Only students can submit assignments', 403);
        }
        const submission = await assignment_service_1.AssignmentService.submitAssignment({
            assignmentId: req.params.id,
            studentId: studentProfile.id,
            fileUrl: req.body.fileUrl,
            content: req.body.content,
            schoolId: req.schoolId,
        });
        return apiResponse_1.ApiResponse.success(res, submission, 'Assignment submitted successfully', 201);
    }
    catch (error) {
        next(error);
    }
};
exports.submitAssignment = submitAssignment;
const gradeSubmission = async (req, res, next) => {
    try {
        const graded = await assignment_service_1.AssignmentService.gradeSubmission({
            submissionId: req.params.submissionId,
            marks: req.body.marks,
            grade: req.body.grade,
            feedback: req.body.feedback,
            gradedBy: req.user?.id,
            schoolId: req.schoolId,
        });
        return apiResponse_1.ApiResponse.success(res, graded, 'Assignment graded successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.gradeSubmission = gradeSubmission;
const getMySubmissions = async (req, res, next) => {
    try {
        const studentProfile = await config_1.prisma.studentProfile.findUnique({
            where: { userId: req.user?.id },
        });
        if (!studentProfile) {
            return apiResponse_1.ApiResponse.error(res, 'Student profile not found', 404);
        }
        const submissions = await assignment_service_1.AssignmentService.getMySubmissions(studentProfile.id);
        return apiResponse_1.ApiResponse.success(res, submissions, 'Submissions retrieved');
    }
    catch (error) {
        next(error);
    }
};
exports.getMySubmissions = getMySubmissions;
const getAssignmentSubmissions = async (req, res, next) => {
    try {
        const teacherProfile = await config_1.prisma.teacherProfile.findUnique({
            where: { userId: req.user?.id },
        });
        const submissions = await assignment_service_1.AssignmentService.getAssignmentSubmissions(req.params.id, teacherProfile?.userId, req.schoolId);
        return apiResponse_1.ApiResponse.success(res, submissions, 'Assignment submissions');
    }
    catch (error) {
        next(error);
    }
};
exports.getAssignmentSubmissions = getAssignmentSubmissions;
