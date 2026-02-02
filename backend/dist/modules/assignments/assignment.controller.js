"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignmentSubmissions = exports.getMySubmissions = exports.gradeSubmission = exports.submitAssignment = exports.getAssignments = exports.createAssignment = void 0;
const assignment_service_1 = require("./assignment.service");
const apiResponse_1 = require("../../utils/apiResponse");
const createAssignment = async (req, res, next) => {
    try {
        const teacherProfile = await require('../../config').prisma.teacherProfile.findUnique({
            where: { userId: req.user.id },
        });
        if (!teacherProfile) {
            return new apiResponse_1.ApiResponse(res, 403, 'Only teachers can create assignments').send();
        }
        const assignment = await assignment_service_1.AssignmentService.createAssignment({
            ...req.body,
            teacherId: teacherProfile.id,
            userId: req.user.id,
            schoolId: req.schoolId,
        });
        new apiResponse_1.ApiResponse(res, 201, 'Assignment created successfully', assignment).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createAssignment = createAssignment;
const getAssignments = async (req, res, next) => {
    try {
        const assignments = await assignment_service_1.AssignmentService.getAssignments(req.query, req.schoolId, req.user.id, req.user.role);
        new apiResponse_1.ApiResponse(res, 200, 'Assignments retrieved', assignments).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAssignments = getAssignments;
const submitAssignment = async (req, res, next) => {
    try {
        const studentProfile = await require('../../config').prisma.studentProfile.findUnique({
            where: { userId: req.user.id },
        });
        if (!studentProfile) {
            return new apiResponse_1.ApiResponse(res, 403, 'Only students can submit assignments').send();
        }
        const submission = await assignment_service_1.AssignmentService.submitAssignment({
            assignmentId: req.params.id,
            studentId: studentProfile.id,
            fileUrl: req.body.fileUrl,
            content: req.body.content,
        });
        new apiResponse_1.ApiResponse(res, 201, 'Assignment submitted successfully', submission).send();
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
            gradedBy: req.user.id,
        });
        new apiResponse_1.ApiResponse(res, 200, 'Assignment graded successfully', graded).send();
    }
    catch (error) {
        next(error);
    }
};
exports.gradeSubmission = gradeSubmission;
const getMySubmissions = async (req, res, next) => {
    try {
        const studentProfile = await require('../../config').prisma.studentProfile.findUnique({
            where: { userId: req.user.id },
        });
        if (!studentProfile) {
            return new apiResponse_1.ApiResponse(res, 404, 'Student profile not found').send();
        }
        const submissions = await assignment_service_1.AssignmentService.getMySubmissions(studentProfile.id);
        new apiResponse_1.ApiResponse(res, 200, 'Submissions retrieved', submissions).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getMySubmissions = getMySubmissions;
const getAssignmentSubmissions = async (req, res, next) => {
    try {
        const teacherProfile = await require('../../config').prisma.teacherProfile.findUnique({
            where: { userId: req.user.id },
        });
        const submissions = await assignment_service_1.AssignmentService.getAssignmentSubmissions(req.params.id, teacherProfile?.userId);
        new apiResponse_1.ApiResponse(res, 200, 'Assignment submissions', submissions).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getAssignmentSubmissions = getAssignmentSubmissions;
