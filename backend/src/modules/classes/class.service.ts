import { prisma } from '../../config';

export class ClassService {
    static async getClasses(schoolId?: string) {
        const where: any = { deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        return prisma.class.findMany({
            where,
            include: {
                sections: {
                    where: { deletedAt: null }
                },
                _count: {
                    select: { students: true }
                }
            },
            orderBy: { name: 'asc' },
        });
    }

    static async getSections(schoolId?: string) {
        const where: any = { deletedAt: null };

        return prisma.section.findMany({
            where: {
                ...where,
                class: schoolId ? { schoolId, deletedAt: null } : { deletedAt: null }
            },
            include: {
                class: true,
                _count: {
                    select: { students: true }
                }
            },
            orderBy: { name: 'asc' },
        });
    }

    static async createClass(name: string, grade: string, schoolId?: string) {
        return prisma.class.create({
            data: {
                name,
                grade,
                schoolId
            }
        });
    }

    static async createSection(name: string, classId: string, schoolId?: string) {
        // Verify class belongs to the school
        if (schoolId) {
            const cls = await prisma.class.findFirst({
                where: { id: classId, schoolId }
            });
            if (!cls) throw new Error('Class not found in this school');
        }

        return prisma.section.create({
            data: {
                name,
                classId
            }
        });
    }

    static async updateClass(id: string, name?: string, grade?: string, schoolId?: string) {
        const where: any = { id, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const cls = await prisma.class.findFirst({ where });
        if (!cls) throw new Error('Class not found');

        return prisma.class.update({
            where: { id },
            data: { name, grade }
        });
    }

    static async updateSection(id: string, name: string, schoolId?: string) {
        const section = await prisma.section.findFirst({
            where: {
                id,
                deletedAt: null,
                class: schoolId ? { schoolId } : undefined
            }
        });

        if (!section) throw new Error('Section not found');

        return prisma.section.update({
            where: { id },
            data: { name }
        });
    }

    static async deleteClass(id: string, schoolId?: string) {
        const where: any = { id, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const cls = await prisma.class.findFirst({ where });
        if (!cls) throw new Error('Class not found');

        return prisma.class.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }

    static async deleteSection(id: string, schoolId?: string) {
        const section = await prisma.section.findFirst({
            where: {
                id,
                deletedAt: null,
                class: schoolId ? { schoolId } : undefined
            }
        });

        if (!section) throw new Error('Section not found');

        return prisma.section.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }

    static async getSubjects(schoolId?: string, classId?: string) {
        const where: any = { deletedAt: null };
        if (schoolId) where.schoolId = schoolId;
        if (classId) where.classId = classId;

        return prisma.subject.findMany({
            where,
            include: {
                class: true,
                teacher: {
                    include: {
                        user: {
                            select: { firstName: true, lastName: true }
                        }
                    }
                }
            },
            orderBy: { name: 'asc' },
        });
    }

    static async createSubject(data: { name: string; code?: string; classId: string; teacherId?: string; schoolId?: string }) {
        return prisma.subject.create({
            data: {
                name: data.name,
                code: data.code,
                classId: data.classId,
                teacherId: data.teacherId,
                schoolId: data.schoolId as string
            }
        });
    }

    static async deleteSubject(id: string, schoolId?: string) {
        const where: any = { id, deletedAt: null };
        if (schoolId) where.schoolId = schoolId;

        const subject = await prisma.subject.findFirst({ where });
        if (!subject) throw new Error('Subject not found');

        return prisma.subject.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }
}
