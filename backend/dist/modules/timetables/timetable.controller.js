"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEntry = exports.updateEntry = exports.getTimetable = exports.createEntry = void 0;
const timetable_service_1 = require("./timetable.service");
const apiResponse_1 = require("../../utils/apiResponse");
const createEntry = async (req, res, next) => {
    try {
        const schoolId = req.schoolId;
        const entry = await timetable_service_1.TimetableService.createEntry({ ...req.body, schoolId });
        new apiResponse_1.ApiResponse(res, 201, 'Timetable entry created', entry).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createEntry = createEntry;
const getTimetable = async (req, res, next) => {
    try {
        const schoolId = req.schoolId;
        const { classId, sectionId, teacherId } = req.query;
        const timetable = await timetable_service_1.TimetableService.getTimetable({
            classId: classId,
            sectionId: sectionId,
            teacherId: teacherId,
            schoolId,
        });
        new apiResponse_1.ApiResponse(res, 200, 'Timetable retrieved', timetable).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getTimetable = getTimetable;
const updateEntry = async (req, res, next) => {
    try {
        const schoolId = req.schoolId;
        const entry = await timetable_service_1.TimetableService.updateEntry(req.params.id, req.body, schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Timetable entry updated', entry).send();
    }
    catch (error) {
        next(error);
    }
};
exports.updateEntry = updateEntry;
const deleteEntry = async (req, res, next) => {
    try {
        const schoolId = req.schoolId;
        await timetable_service_1.TimetableService.deleteEntry(req.params.id, schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Timetable entry deleted').send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEntry = deleteEntry;
