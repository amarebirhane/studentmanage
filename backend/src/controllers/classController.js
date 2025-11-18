const prisma = require('../lib/prisma');

const createClass = async (req, res) => {
  try {
    const { name, grade, description } = req.body;
    if (!name || !grade) {
      return res.status(400).json({ message: 'Name and grade are required' });
    }

    const newClass = await prisma.class.create({
      data: { name, grade, description },
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Failed to create class' });
  }
};

const getClasses = async (_req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        sections: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
        students: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
};

const createSection = async (req, res) => {
  try {
    const { classId, name, teacherId } = req.body;
    if (!classId || !name) {
      return res.status(400).json({ message: 'classId and name are required' });
    }

    const classExists = await prisma.class.findUnique({ where: { id: classId } });
    if (!classExists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (teacherId) {
      const teacherExists = await prisma.teacherProfile.findUnique({ where: { id: teacherId } });
      if (!teacherExists) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
    }

    const section = await prisma.section.create({
      data: {
        name,
        classId,
        teacherId,
      },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json(section);
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({ message: 'Failed to create section' });
  }
};

const assignStudentToSection = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { classId, sectionId } = req.body;

    const student = await prisma.studentProfile.findUnique({ where: { id: studentId } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (classId) {
      const classExists = await prisma.class.findUnique({ where: { id: classId } });
      if (!classExists) {
        return res.status(404).json({ message: 'Class not found' });
      }
    }

    if (sectionId) {
      const sectionExists = await prisma.section.findUnique({ where: { id: sectionId } });
      if (!sectionExists) {
        return res.status(404).json({ message: 'Section not found' });
      }
    }

    const updated = await prisma.studentProfile.update({
      where: { id: studentId },
      data: { classId, sectionId },
      include: {
        class: true,
        section: true,
        user: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Assign section error:', error);
    res.status(500).json({ message: 'Failed to assign student' });
  }
};

module.exports = {
  createClass,
  getClasses,
  createSection,
  assignStudentToSection,
};
