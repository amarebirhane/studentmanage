"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacher_controller_1 = require("./teacher.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.route('/')
    .get(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('ADMIN', 'TEACHER'), teacher_controller_1.TeacherController.getTeachers)
    .post(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('ADMIN'), teacher_controller_1.TeacherController.createTeacher);
router.route('/:id')
    .get(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('ADMIN', 'TEACHER'), teacher_controller_1.TeacherController.getTeacherById)
    .put(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('ADMIN'), teacher_controller_1.TeacherController.updateTeacher)
    .delete(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('ADMIN'), teacher_controller_1.TeacherController.deleteTeacher);
exports.default = router;
