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
exports.getSchools = exports.deleteSchool = exports.updateSchool = exports.getSchool = exports.createSchool = void 0;
const schoolService = __importStar(require("./school.service"));
const apiResponse_1 = require("../../utils/apiResponse");
const createSchool = async (req, res, next) => {
    try {
        const school = await schoolService.createSchool(req.body);
        new apiResponse_1.ApiResponse(res, 201, 'School created successfully', school).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createSchool = createSchool;
const getSchool = async (req, res, next) => {
    try {
        const school = await schoolService.getSchoolById(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'School details', school).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getSchool = getSchool;
const updateSchool = async (req, res, next) => {
    try {
        const school = await schoolService.updateSchool(req.params.id, req.body);
        new apiResponse_1.ApiResponse(res, 200, 'School updated successfully', school).send();
    }
    catch (error) {
        next(error);
    }
};
exports.updateSchool = updateSchool;
const deleteSchool = async (req, res, next) => {
    try {
        await schoolService.deleteSchool(req.params.id);
        new apiResponse_1.ApiResponse(res, 200, 'School deleted successfully').send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSchool = deleteSchool;
const getSchools = async (req, res, next) => {
    try {
        const schools = await schoolService.getAllSchools();
        new apiResponse_1.ApiResponse(res, 200, 'All schools', schools).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getSchools = getSchools;
