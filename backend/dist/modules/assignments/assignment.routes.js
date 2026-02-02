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
const express_1 = require("express");
const assignmentController = __importStar(require("./assignment.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect); // All routes require authentication
// Create assignment (teachers only)
router.post('/', (0, role_middleware_1.authorize)('TEACHER', 'ADMIN'), assignmentController.createAssignment);
// Get assignments (students see theirs, teachers see all they created)
router.get('/', assignmentController.getAssignments);
// Submit assignment (students only)
router.post('/:id/submit', (0, role_middleware_1.authorize)('STUDENT'), assignmentController.submitAssignment);
// Grade submission (teachers only)
router.patch('/submissions/:submissionId/grade', (0, role_middleware_1.authorize)('TEACHER', 'ADMIN'), assignmentController.gradeSubmission);
// Get my submissions (students)
router.get('/my-submissions', (0, role_middleware_1.authorize)('STUDENT'), assignmentController.getMySubmissions);
// Get assignment submissions (teachers)
router.get('/:id/submissions', (0, role_middleware_1.authorize)('TEACHER', 'ADMIN'), assignmentController.getAssignmentSubmissions);
exports.default = router;
