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
const examController = __importStar(require("./exam.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const tenant_middleware_1 = require("../../middlewares/tenant.middleware");
const permission_middleware_1 = require("../../middlewares/permission.middleware");
const router = (0, express_1.Router)();
// Apply protection and tenant isolation to all exam routes
router.use(auth_middleware_1.protect, tenant_middleware_1.tenantMiddleware);
// Create Exam
router.post('/', (0, permission_middleware_1.checkPermission)('exams', 'create'), examController.createExam);
// Get All Exams
router.get('/', (0, permission_middleware_1.checkPermission)('exams', 'view'), examController.getAllExams);
// Student: Get My Results
router.get('/my-results', examController.getMyResults // Specific view for students
);
// Enter Marks
router.put('/:id/marks', (0, permission_middleware_1.checkPermission)('exams', 'edit'), examController.enterMarks);
// Publish Results
router.post('/:id/publish', (0, permission_middleware_1.checkPermission)('exams', 'edit'), examController.publishResults);
// Get Single Exam
router.get('/:id', (0, permission_middleware_1.checkPermission)('exams', 'view'), examController.getExam);
// Update Exam
router.patch('/:id', (0, permission_middleware_1.checkPermission)('exams', 'edit'), examController.updateExam);
// Delete Exam
router.delete('/:id', (0, permission_middleware_1.checkPermission)('exams', 'delete'), examController.deleteExam);
exports.default = router;
