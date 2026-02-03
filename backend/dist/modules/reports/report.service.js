"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const exceljs_1 = __importDefault(require("exceljs"));
const config_1 = require("../../config");
class ReportService {
    /**
     * Generate Attendance Report (PDF)
     */
    static async generateAttendanceReport(data) {
        const doc = new pdfkit_1.default();
        // Fetch Data
        const where = {
            date: {
                gte: data.dateFrom,
                lte: data.dateTo
            }
        };
        if (data.schoolId)
            where.schoolId = data.schoolId;
        // Filter by students in class/section if provided
        if (data.classId || data.sectionId) {
            where.student = {};
            if (data.classId)
                where.student.classId = data.classId;
            if (data.sectionId)
                where.student.sectionId = data.sectionId;
        }
        const attendanceRecords = await config_1.prisma.attendanceRecord.findMany({
            where,
            include: {
                student: {
                    include: {
                        user: { select: { firstName: true, lastName: true } },
                        section: { select: { name: true } },
                        class: { select: { name: true } }
                    }
                }
            },
            orderBy: [{ date: 'asc' }, { student: { user: { firstName: 'asc' } } }]
        });
        // PDF Content
        doc.fontSize(20).text('Attendance Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`From: ${data.dateFrom.toDateString()} To: ${data.dateTo.toDateString()}`);
        doc.moveDown();
        // Table Header
        const startY = doc.y;
        doc.text('Date', 50, startY);
        doc.text('Student', 150, startY);
        doc.text('Class/Sec', 300, startY);
        doc.text('Status', 450, startY);
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        // Table Rows
        attendanceRecords.forEach((record) => {
            const y = doc.y;
            if (y > 700) { // New page if near bottom
                doc.addPage();
                doc.text('Date', 50, 50);
                doc.text('Student', 150, 50);
                doc.text('Class/Sec', 300, 50);
                doc.text('Status', 450, 50);
                doc.moveDown();
                doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            }
            doc.text(record.date.toDateString(), 50, doc.y);
            doc.text(`${record.student.user.firstName} ${record.student.user.lastName}`, 150, doc.y - 14); // Adjust Y because prev text moved it down
            doc.text(`${record.student.class?.name || ''} - ${record.student.section?.name || ''}`, 300, doc.y - 14);
            // Color code status
            if (record.status === 'ABSENT')
                doc.fillColor('red');
            else if (record.status === 'LATE')
                doc.fillColor('orange');
            else
                doc.fillColor('black');
            doc.text(record.status, 450, doc.y - 14);
            doc.fillColor('black'); // Reset
            doc.moveDown();
        });
        return doc;
    }
    /**
     * Generate Exam Result Report (Excel)
     */
    static async generateExamReport(examId) {
        const workbook = new exceljs_1.default.Workbook();
        const sheet = workbook.addWorksheet('Results');
        const exam = await config_1.prisma.exam.findUnique({
            where: { id: examId },
            include: {
                class: true,
                section: true
            }
        });
        if (!exam)
            throw new Error('Exam not found');
        const grades = await config_1.prisma.gradeRecord.findMany({
            where: { examId },
            include: {
                student: {
                    include: {
                        user: { select: { firstName: true, lastName: true, email: true } }
                    }
                }
            }
        });
        // Header Info
        sheet.getCell('A1').value = `Exam: ${exam.name}`;
        sheet.getCell('A2').value = `Subject: ${exam.subject || 'N/A'}`;
        sheet.getCell('A3').value = `Date: ${exam.examDate.toDateString()}`;
        sheet.getCell('A4').value = `Class: ${exam.class?.name || 'N/A'} ${exam.section?.name || ''}`;
        sheet.getRow(6).values = ['Student Name', 'Email', 'Marks Scored', 'Total Marks', 'Grade', 'Remarks'];
        sheet.getRow(6).font = { bold: true };
        grades.forEach((grade) => {
            sheet.addRow([
                `${grade.student.user.firstName} ${grade.student.user.lastName}`,
                grade.student.user.email,
                grade.scoredMarks,
                grade.totalMarks,
                grade.grade,
                grade.remarks
            ]);
        });
        return workbook;
    }
    /**
     * Generate Individual Student Report Card (PDF)
     */
    static async generateReportCardPDF(studentId, schoolId) {
        const doc = new pdfkit_1.default();
        const student = await config_1.prisma.studentProfile.findFirst({
            where: { id: studentId, schoolId },
            include: {
                user: { select: { firstName: true, lastName: true } },
                class: { select: { name: true } },
                section: { select: { name: true } }
            }
        });
        if (!student)
            throw new Error('Student not found');
        const grades = await config_1.prisma.gradeRecord.findMany({
            where: { studentId },
            include: { exam: true }
        });
        const studentData = student;
        // PDF Content
        doc.fontSize(22).text('Academic Report Card', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Name: ${studentData.user.firstName} ${studentData.user.lastName}`);
        doc.text(`Enrollment No: ${studentData.enrollmentNo || 'N/A'}`);
        doc.text(`Class: ${studentData.class?.name || 'N/A'} - ${studentData.section?.name || 'N/A'}`);
        doc.moveDown();
        // Table Header
        const startY = doc.y;
        doc.fontSize(12).text('Subject', 50, startY);
        doc.text('Exam', 200, startY);
        doc.text('Marks', 350, startY);
        doc.text('Grade', 450, startY);
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        let totalScored = 0;
        let totalMax = 0;
        grades.forEach((grade) => {
            const y = doc.y;
            if (y > 700) {
                doc.addPage();
                doc.fontSize(12).text('Subject', 50, 50);
                doc.text('Exam', 200, 50);
                doc.text('Marks', 350, 50);
                doc.text('Grade', 450, 50);
                doc.moveDown();
                doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            }
            doc.text(grade.subject, 50, doc.y);
            doc.text(grade.exam.name, 200, doc.y - 12);
            doc.text(`${grade.scoredMarks}/${grade.totalMarks}`, 350, doc.y - 12);
            doc.text(grade.grade || '-', 450, doc.y - 12);
            doc.moveDown();
            totalScored += grade.scoredMarks;
            totalMax += grade.totalMarks;
        });
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();
        const percentage = totalMax > 0 ? (totalScored / totalMax) * 100 : 0;
        doc.fontSize(14).text(`Total Marks: ${totalScored} / ${totalMax}`, { align: 'right' });
        doc.text(`Percentage: ${percentage.toFixed(2)}%`, { align: 'right' });
        return doc;
    }
    /**
     * Get Student Performance Analytics
     */
    static async getPerformanceAnalytics(studentId, schoolId) {
        return config_1.prisma.performanceInsight.findMany({
            where: { studentId },
            orderBy: { generatedAt: 'desc' },
            take: 10
        });
    }
}
exports.ReportService = ReportService;
