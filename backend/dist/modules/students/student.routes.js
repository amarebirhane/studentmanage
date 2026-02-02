"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("./student.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const permission_middleware_1 = require("../../middlewares/permission.middleware");
const tenant_middleware_1 = require("../../middlewares/tenant.middleware");
const router = (0, express_1.Router)();
// Apply protection and tenant middleware to all student routes
router.use(auth_middleware_1.protect, tenant_middleware_1.tenantMiddleware);
router.route('/')
    .get((0, permission_middleware_1.checkPermission)('students', 'view'), student_controller_1.StudentController.getStudents)
    .post((0, permission_middleware_1.checkPermission)('students', 'create'), student_controller_1.StudentController.createStudent);
router.post('/:id/approve', (0, permission_middleware_1.checkPermission)('students', 'edit'), student_controller_1.StudentController.approveAdmission);
router.route('/:id')
    .get((0, permission_middleware_1.checkPermission)('students', 'view'), student_controller_1.StudentController.getStudentById)
    .put((0, permission_middleware_1.checkPermission)('students', 'edit'), student_controller_1.StudentController.updateStudent)
    .delete((0, permission_middleware_1.checkPermission)('students', 'delete'), student_controller_1.StudentController.deleteStudent);
exports.default = router;
