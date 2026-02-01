"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("./student.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.route('/')
    .get(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('ADMIN', 'TEACHER'), student_controller_1.StudentController.getStudents)
    .post(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('ADMIN'), student_controller_1.StudentController.createStudent);
router.route('/:id')
    .get(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('ADMIN', 'TEACHER'), student_controller_1.StudentController.getStudentById)
    .put(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('ADMIN'), student_controller_1.StudentController.updateStudent)
    .delete(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('ADMIN'), student_controller_1.StudentController.deleteStudent);
exports.default = router;
