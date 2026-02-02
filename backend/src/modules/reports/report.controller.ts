import { Request, Response, NextFunction } from 'express';
import { ReportService } from './report.service';
import { ApiResponse } from '../../utils/apiResponse';

export const getAttendanceReport = async (req: any, res: Response, next: NextFunction) => {
    try {
        const filters = {
            classId: req.query.classId as string,
            sectionId: req.query.sectionId as string,
            dateFrom: new Date(req.query.dateFrom as string),
            dateTo: new Date(req.query.dateTo as string),
            schoolId: req.schoolId,
        };

        const doc = await ReportService.generateAttendanceReport(filters);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="attendance-report.pdf"');

        doc.pipe(res);
        doc.end();
    } catch (error) {
        next(error);
    }
};

export const getExamReport = async (req: any, res: Response, next: NextFunction) => {
    try {
        const examId = req.params.examId;
        const workbook = await ReportService.generateExamReport(examId);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="exam-results.xlsx"');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        next(error);
    }
};
