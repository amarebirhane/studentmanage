const prisma = require('../lib/prisma');

const createExam = async (req, res) => {
  try {
    const { name, term, examDate, classId, sectionId, maxMarks = 100 } = req.body;

    if (!name || !examDate) {
      return res.status(400).json({ message: 'Name and examDate are required' });
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        term,
        examDate: new Date(examDate),
        classId,
        sectionId,
        maxMarks,
        createdById: req.user.id,
      },
    });

    res.status(201).json(exam);
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ message: 'Failed to create exam' });
  }
};

const recordGrades = async (req, res) => {
  try {
    const { examId, grades } = req.body;

    if (!examId || !Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({ message: 'examId and grades array are required' });
    }

    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    await prisma.$transaction(async (tx) => {
      for (const grade of grades) {
        const gpa = grade.totalMarks ? Number(((grade.scoredMarks / grade.totalMarks) * 4).toFixed(2)) : null;
        await tx.gradeRecord.upsert({
          where: {
            studentId_examId_subject: {
              studentId: grade.studentId,
              examId,
              subject: grade.subject,
            },
          },
          update: {
            scoredMarks: grade.scoredMarks,
            totalMarks: grade.totalMarks,
            grade: grade.grade,
            gpa,
            remarks: grade.remarks,
          },
          create: {
            studentId: grade.studentId,
            examId,
            subject: grade.subject,
            scoredMarks: grade.scoredMarks,
            totalMarks: grade.totalMarks,
            grade: grade.grade,
            gpa,
            remarks: grade.remarks,
          },
        });
      }
    });

    res.json({ message: 'Grades recorded successfully' });
  } catch (error) {
    console.error('Record grades error:', error);
    res.status(500).json({ message: 'Failed to record grades' });
  }
};

const getReportCard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const grades = await prisma.gradeRecord.findMany({
      where: { studentId },
      include: {
        exam: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!grades.length) {
      return res.status(404).json({ message: 'No grades found for this student' });
    }

    const avgGpa = (
      grades.reduce((sum, record) => sum + (record.gpa || 0), 0) / grades.length
    ).toFixed(2);

    res.json({ grades, averageGpa: Number(avgGpa) });
  } catch (error) {
    console.error('Report card error:', error);
    res.status(500).json({ message: 'Failed to fetch report card' });
  }
};

module.exports = {
  createExam,
  recordGrades,
  getReportCard,
};
