"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExamReport = exports.getAttendanceReport = void 0;
const report_service_1 = require("./report.service");
const getAttendanceReport = async (req, res, next) => {
    try {
        const filters = {
            classId: req.query.classId,
            sectionId: req.query.sectionId,
            dateFrom: new Date(req.query.dateFrom),
            dateTo: new Date(req.query.dateTo),
            schoolId: req.schoolId,
        };
        const doc = await report_service_1.ReportService.generateAttendanceReport(filters);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="attendance-report.pdf"');
        doc.pipe(res);
        doc.end();
    }
    catch (error) {
        next(error);
    }
};
exports.getAttendanceReport = getAttendanceReport;
const getExamReport = async (req, res, next) => {
    try {
        const examId = req.params.examId;
        const workbook = await report_service_1.ReportService.generateExamReport(examId);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="exam-results.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
    }
    catch (error) {
        next(error);
    }
};
exports.getExamReport = getExamReport;
