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
const announcementController = __importStar(require("./announcement.controller"));
const permission_middleware_1 = require("../../middlewares/permission.middleware");
const router = (0, express_1.Router)();
// Routes are already protected and tenant-isolated by the parent router in routes.ts
router.post('/', (0, permission_middleware_1.checkPermission)('announcements', 'create'), announcementController.createAnnouncement);
router.get('/', (0, permission_middleware_1.checkPermission)('announcements', 'view'), announcementController.getAnnouncements);
router.get('/:id', (0, permission_middleware_1.checkPermission)('announcements', 'view'), announcementController.getAnnouncement);
router.patch('/:id', (0, permission_middleware_1.checkPermission)('announcements', 'edit'), announcementController.updateAnnouncement);
router.delete('/:id', (0, permission_middleware_1.checkPermission)('announcements', 'delete'), announcementController.deleteAnnouncement);
exports.default = router;
