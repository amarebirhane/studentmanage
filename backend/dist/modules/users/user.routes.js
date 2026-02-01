"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect, (0, auth_middleware_1.authorize)('ADMIN'));
router.route('/')
    .get(user_controller_1.UserController.getUsers);
router.route('/:id')
    .get(user_controller_1.UserController.getUserById)
    .put(user_controller_1.UserController.updateUser)
    .delete(user_controller_1.UserController.deleteUser);
exports.default = router;
