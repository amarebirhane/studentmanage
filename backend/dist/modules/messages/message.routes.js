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
const messageController = __importStar(require("./message.controller"));
const permission_middleware_1 = require("../../middlewares/permission.middleware");
const router = (0, express_1.Router)();
// Routes are already protected and tenant-isolated by the parent router in routes.ts
router.post('/', (0, permission_middleware_1.checkPermission)('messages', 'create'), messageController.sendMessage);
router.get('/inbox', (0, permission_middleware_1.checkPermission)('messages', 'view'), messageController.getInbox);
router.get('/sent', (0, permission_middleware_1.checkPermission)('messages', 'view'), messageController.getSentMessages);
router.patch('/:id/read', (0, permission_middleware_1.checkPermission)('messages', 'edit'), messageController.markAsRead);
router.delete('/:id', (0, permission_middleware_1.checkPermission)('messages', 'delete'), messageController.deleteMessage);
exports.default = router;
