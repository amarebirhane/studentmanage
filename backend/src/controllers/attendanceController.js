const prisma = require('../lib/prisma');

const recordAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'Date and attendance records are required' });
    }

    const attendanceDate = new Date(date);

    await prisma.$transaction(async (tx) => {
      for (const record of records) {
        await tx.attendanceRecord.upsert({
          where: {
            studentId_date: {
              studentId: record.studentId,
              date: attendanceDate,
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks,
            recordedById: req.user.id,
          },
          create: {
            studentId: record.studentId,
            date: attendanceDate,
            status: record.status,
            remarks: record.remarks,
            recordedById: req.user.id,
          },
        });
      }
    });

    res.json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error('Record attendance error:', error);
    res.status(500).json({ message: 'Failed to record attendance' });
  }
};

const getAttendanceForDate = async (req, res) => {
  try {
    const { date } = req.query;
    const attendanceDate = date ? new Date(date) : new Date();

    const records = await prisma.attendanceRecord.findMany({
      where: { date: attendanceDate },
      include: {
        student: {
          include: { user: true, class: true, section: true },
        },
      },
    });

    res.json(records);
  } catch (error) {
    console.error('Get daily attendance error:', error);
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    const where = { studentId };
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const records = await prisma.attendanceRecord.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    const summary = records.reduce(
      (acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      },
      {}
    );

    res.json({ records, summary });
  } catch (error) {
    console.error('Get attendance report error:', error);
    res.status(500).json({ message: 'Failed to fetch attendance report' });
  }
};

module.exports = {
  recordAttendance,
  getAttendanceForDate,
  getAttendanceReport,
};
