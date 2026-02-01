"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const student_routes_1 = __importDefault(require("./modules/students/student.routes"));
const class_routes_1 = __importDefault(require("./modules/classes/class.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/students', student_routes_1.default);
router.use('/classes', class_routes_1.default);
router.use('/admin', user_routes_1.default);
exports.default = router;
