import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { prisma } from '../../config';
import fs from 'fs';

export class ReportService {
    /**
     * Generate Attendance Report (PDF)
     */
    static async generateAttendanceReport(data: {
        classId?: string;
        sectionId?: string;
        dateFrom: Date;
        dateTo: Date;
        schoolId?: string;
    }): Promise<PDFKit.PDFDocument> {
        const doc = new PDFDocument();

        // Fetch Data
        const where: any = {
            date: {
                gte: data.dateFrom,
                lte: data.dateTo
            }
        };
        if (data.schoolId) where.schoolId = data.schoolId;

        // Filter by students in class/section if provided
        if (data.classId || data.sectionId) {
            where.student = {};
            if (data.classId) where.student.classId = data.classId;
            if (data.sectionId) where.student.sectionId = data.sectionId;
        }

        const attendanceRecords = await prisma.attendanceRecord.findMany({
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
            if (record.status === 'ABSENT') doc.fillColor('red');
            else if (record.status === 'LATE') doc.fillColor('orange');
            else doc.fillColor('black');

            doc.text(record.status, 450, doc.y - 14);
            doc.fillColor('black'); // Reset
            doc.moveDown();
        });

        return doc;
    }

    /**
     * Generate Exam Result Report (Excel)
     */
    static async generateExamReport(examId: string): Promise<ExcelJS.Workbook> {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Results');

        const exam = await prisma.exam.findUnique({
            where: { id: examId },
            include: {
                class: true,
                section: true
            }
        });

        if (!exam) throw new Error('Exam not found');

        const grades = await prisma.gradeRecord.findMany({
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
}
