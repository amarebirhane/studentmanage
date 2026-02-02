"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("./student.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.route('/')
    .get(student_controller_1.StudentController.getStudents) // Middleware in routes.ts handles protection
    .post((0, auth_middleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), student_controller_1.StudentController.createStudent);
router.post('/:id/approve', (0, auth_middleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), student_controller_1.StudentController.approveAdmission);
router.route('/:id')
    .get((0, auth_middleware_1.authorize)('ADMIN', 'TEACHER', 'PARENT', 'SUPER_ADMIN'), student_controller_1.StudentController.getStudentById)
    .put((0, auth_middleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), student_controller_1.StudentController.updateStudent)
    .delete((0, auth_middleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), student_controller_1.StudentController.deleteStudent);
exports.default = router;
