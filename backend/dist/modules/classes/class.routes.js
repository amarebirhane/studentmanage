"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const class_controller_1 = require("./class.controller");
const permission_middleware_1 = require("../../middlewares/permission.middleware");
const router = (0, express_1.Router)();
// Routes are already protected and tenant-isolated by the parent router in routes.ts
router.get('/', (0, permission_middleware_1.checkPermission)('classes', 'view'), class_controller_1.ClassController.getClasses);
router.get('/sections', (0, permission_middleware_1.checkPermission)('classes', 'view'), class_controller_1.ClassController.getSections);
router.post('/', (0, permission_middleware_1.checkPermission)('classes', 'create'), class_controller_1.ClassController.createClass);
router.post('/sections', (0, permission_middleware_1.checkPermission)('classes', 'create'), class_controller_1.ClassController.createSection);
router.delete('/:id', (0, permission_middleware_1.checkPermission)('classes', 'delete'), class_controller_1.ClassController.deleteClass);
router.delete('/sections/:id', (0, permission_middleware_1.checkPermission)('classes', 'delete'), class_controller_1.ClassController.deleteSection);
exports.default = router;
