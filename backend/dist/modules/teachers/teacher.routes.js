"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacher_controller_1 = require("./teacher.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const tenant_middleware_1 = require("../../middlewares/tenant.middleware");
const permission_middleware_1 = require("../../middlewares/permission.middleware");
const router = (0, express_1.Router)();
// Apply protection and tenant isolation to all teacher routes
router.use(auth_middleware_1.protect, tenant_middleware_1.tenantMiddleware);
router.route('/')
    .get((0, permission_middleware_1.checkPermission)('teachers', 'view'), teacher_controller_1.TeacherController.getTeachers)
    .post((0, permission_middleware_1.checkPermission)('teachers', 'create'), teacher_controller_1.TeacherController.createTeacher);
router.get('/dashboard', teacher_controller_1.TeacherController.getDashboardStats); // Role-specific view
router.route('/:id')
    .get((0, permission_middleware_1.checkPermission)('teachers', 'view'), teacher_controller_1.TeacherController.getTeacherById)
    .put((0, permission_middleware_1.checkPermission)('teachers', 'edit'), teacher_controller_1.TeacherController.updateTeacher)
    .delete((0, permission_middleware_1.checkPermission)('teachers', 'delete'), teacher_controller_1.TeacherController.deleteTeacher);
exports.default = router;
