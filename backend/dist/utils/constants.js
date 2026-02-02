"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_TYPES = exports.ROLES = void 0;
exports.ROLES = {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT',
    PARENT: 'PARENT',
};
exports.TOKEN_TYPES = {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'resetPassword',
    VERIFY_EMAIL: 'verifyEmail',
};
