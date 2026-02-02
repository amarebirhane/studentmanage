"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feeController = __importStar(require("./fee.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.post('/', (0, role_middleware_1.authorize)(client_1.UserRole.ADMIN), feeController.createFeeInvoice);
router.get('/', (0, role_middleware_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.PARENT, client_1.UserRole.STUDENT), feeController.getAllFeeInvoices);
router.get('/:id', (0, role_middleware_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.PARENT, client_1.UserRole.STUDENT), feeController.getFeeInvoice);
router.patch('/:id', (0, role_middleware_1.authorize)(client_1.UserRole.ADMIN), feeController.updateFeeInvoice);
router.delete('/:id', (0, role_middleware_1.authorize)(client_1.UserRole.ADMIN), feeController.deleteFeeInvoice);
exports.default = router;
