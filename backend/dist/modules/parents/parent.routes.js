"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parent_controller_1 = require("./parent.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('ADMIN'));
router.route('/')
    .get(parent_controller_1.ParentController.getParents)
    .post(parent_controller_1.ParentController.createParent);
router.route('/:id')
    .get(parent_controller_1.ParentController.getParentById)
    .put(parent_controller_1.ParentController.updateParent)
    .delete(parent_controller_1.ParentController.deleteParent);
exports.default = router;
