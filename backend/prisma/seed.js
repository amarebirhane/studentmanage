const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('í¼± Seeding database...');

  const adminEmail = 'admin@school.com';
  const teacherEmail = 'teacher@school.com';
  const studentEmail = 'student@school.com';

  // Clear data (development only)
  await prisma.$transaction([
    prisma.assignmentSubmission.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.gradeRecord.deleteMany(),
    prisma.exam.deleteMany(),
    prisma.attendanceRecord.deleteMany(),
    prisma.document.deleteMany(),
    prisma.behaviorRecord.deleteMany(),
    prisma.feePayment.deleteMany(),
    prisma.feeInvoice.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.onlineExam.deleteMany(),
    prisma.timetableEntry.deleteMany(),
    prisma.section.deleteMany(),
    prisma.class.deleteMany(),
    prisma.parentProfile.deleteMany(),
    prisma.studentProfile.deleteMany(),
    prisma.teacherProfile.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const [admin, teacherUser, studentUser] = await Promise.all([
    prisma.user.create({
      data: {
        firstName: 'Alice',
        lastName: 'Admin',
        email: adminEmail,
        password: await bcrypt.hash('Admin@123', 10),
        role: 'ADMIN',
        phone: '+1-555-0000',
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Tom',
        lastName: 'Teacher',
        email: teacherEmail,
        password: await bcrypt.hash('Teacher@123', 10),
        role: 'TEACHER',
        phone: '+1-555-1111',
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Sally',
        lastName: 'Student',
        email: studentEmail,
        password: await bcrypt.hash('Student@123', 10),
        role: 'STUDENT',
        phone: '+1-555-2222',
      },
    }),
  ]);

  const teacherProfile = await prisma.teacherProfile.create({
    data: {
      userId: teacherUser.id,
      bio: 'Mathematics & Science teacher',
      subjects: 'Mathematics,Science',
    },
  });

  const classA = await prisma.class.create({
    data: {
      name: 'Class 10',
      grade: '10',
      description: 'Senior class',
    },
  });

  const sectionA = await prisma.section.create({
    data: {
      name: 'A',
      classId: classA.id,
      teacherId: teacherProfile.id,
    },
  });

  const studentProfile = await prisma.studentProfile.create({
    data: {
      userId: studentUser.id,
      age: 15,
      gender: 'FEMALE',
      classId: classA.id,
      sectionId: sectionA.id,
      contactAddress: '123 Main Street',
      guardianName: 'Jane Student',
      guardianPhone: '+1-555-9999',
      guardianEmail: 'parent@student.com',
    },
  });

  await prisma.parentProfile.create({
    data: {
      user: {
        create: {
          firstName: 'Paul',
          lastName: 'Parent',
          email: 'parent@school.com',
          password: await bcrypt.hash('Parent@123', 10),
          role: 'PARENT',
          phone: '+1-555-3333',
        },
      },
      studentId: studentProfile.id,
      relationship: 'Father',
    },
  });

  console.log('âœ… Seed completed!');
}

main()
  .catch((error) => {
    console.error('âŒ Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
