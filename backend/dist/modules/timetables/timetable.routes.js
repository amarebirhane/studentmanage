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
const timetableController = __importStar(require("./timetable.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const tenant_middleware_1 = require("../../middlewares/tenant.middleware");
const permission_middleware_1 = require("../../middlewares/permission.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.use(tenant_middleware_1.tenantMiddleware);
router.post('/', (0, permission_middleware_1.checkPermission)('timetable', 'create'), timetableController.createEntry);
router.get('/', (0, permission_middleware_1.checkPermission)('timetable', 'view'), timetableController.getTimetable);
router.patch('/:id', (0, permission_middleware_1.checkPermission)('timetable', 'edit'), timetableController.updateEntry);
router.delete('/:id', (0, permission_middleware_1.checkPermission)('timetable', 'delete'), timetableController.deleteEntry);
exports.default = router;
