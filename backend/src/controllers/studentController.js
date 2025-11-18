const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

const DEFAULT_STUDENT_PASSWORD = 'Student@123';

const buildStudentWhereClause = ({ search, classId, sectionId }) => {
  const where = {};
  if (search) {
    where.OR = [
      { user: { firstName: { contains: search, mode: 'insensitive' } } },
      { user: { lastName: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { guardianName: { contains: search, mode: 'insensitive' } },
      { guardianPhone: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (classId) {
    where.classId = classId;
  }
  if (sectionId) {
    where.sectionId = sectionId;
  }
  return where;
};

const getStudents = async (req, res) => {
  try {
    const { search, classId, sectionId, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const where = buildStudentWhereClause({ search, classId, sectionId });

    const [students, total] = await Promise.all([
      prisma.studentProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              phone: true,
            },
          },
          class: true,
          section: true,
          documents: true,
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc' },
      }),
      prisma.studentProfile.count({ where }),
    ]);

    res.json({
      students,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await prisma.studentProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phone: true,
          },
        },
        class: true,
        section: true,
        documents: true,
        attendances: true,
        grades: {
          include: {
            exam: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Failed to fetch student' });
  }
};

const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      age,
      gender,
      dateOfBirth,
      contactAddress,
      guardianName,
      guardianPhone,
      guardianEmail,
      classId,
      sectionId,
      avatarUrl,
      idDocumentUrl,
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'firstName, lastName and email are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    if (classId) {
      const classExists = await prisma.class.findUnique({ where: { id: classId } });
      if (!classExists) {
        return res.status(400).json({ message: 'Class not found' });
      }
    }

    if (sectionId) {
      const sectionExists = await prisma.section.findUnique({ where: { id: sectionId } });
      if (!sectionExists) {
        return res.status(400).json({ message: 'Section not found' });
      }
    }

    const hashedPassword = await bcrypt.hash(password || DEFAULT_STUDENT_PASSWORD, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: 'STUDENT',
          phone,
        },
      });

      const studentProfile = await tx.studentProfile.create({
        data: {
          userId: user.id,
          age,
          gender,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          contactAddress,
          guardianName,
          guardianPhone,
          guardianEmail,
          classId,
          sectionId,
          avatarUrl,
          idDocumentUrl,
        },
        include: {
          class: true,
          section: true,
        },
      });

      return { user, studentProfile };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Failed to create student' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      age,
      gender,
      dateOfBirth,
      contactAddress,
      guardianName,
      guardianPhone,
      guardianEmail,
      classId,
      sectionId,
      avatarUrl,
      idDocumentUrl,
    } = req.body;

    const student = await prisma.studentProfile.findUnique({ where: { id: req.params.id } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (classId) {
      const classExists = await prisma.class.findUnique({ where: { id: classId } });
      if (!classExists) {
        return res.status(400).json({ message: 'Class not found' });
      }
    }

    if (sectionId) {
      const sectionExists = await prisma.section.findUnique({ where: { id: sectionId } });
      if (!sectionExists) {
        return res.status(400).json({ message: 'Section not found' });
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (firstName || lastName || phone) {
        await tx.user.update({
          where: { id: student.userId },
          data: {
            firstName: firstName ?? undefined,
            lastName: lastName ?? undefined,
            phone: phone ?? undefined,
          },
        });
      }

      return tx.studentProfile.update({
        where: { id: req.params.id },
        data: {
          age,
          gender,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          contactAddress,
          guardianName,
          guardianPhone,
          guardianEmail,
          classId,
          sectionId,
          avatarUrl,
          idDocumentUrl,
        },
        include: {
          user: true,
          class: true,
          section: true,
        },
      });
    });

    res.json(updated);
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Failed to update student' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await prisma.studentProfile.findUnique({ where: { id: req.params.id } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await prisma.$transaction([
      prisma.studentProfile.delete({ where: { id: req.params.id } }),
      prisma.user.delete({ where: { id: student.userId } }),
    ]);

    res.json({ message: 'Student removed' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Failed to delete student' });
  }
};

const getStats = async (_req, res) => {
  try {
    const [totalStudents, totalTeachers, recentAdmissions, latestAttendance] = await Promise.all([
      prisma.studentProfile.count(),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.studentProfile.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          class: true,
          section: true,
        },
      }),
      prisma.attendanceRecord.findMany({
        orderBy: { date: 'desc' },
        take: 30,
        select: {
          status: true,
        },
      }),
    ]);

    const attendanceSummary = latestAttendance.reduce(
      (acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      },
      {}
    );

    res.json({
      totalStudents,
      totalTeachers,
      recentAdmissions,
      attendanceSummary,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to load stats' });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStats,
};
