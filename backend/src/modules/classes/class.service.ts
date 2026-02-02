import { prisma } from '../../config';

export class ClassService {
    static async getClasses(schoolId?: string) {
        const where: any = {};
        if (schoolId) where.schoolId = schoolId;

        return prisma.class.findMany({
            where,
            include: {
                sections: true,
                _count: {
                    select: { students: true }
                }
            },
            orderBy: { name: 'asc' },
        });
    }

    static async getSections(schoolId?: string) {
        const where: any = {};
        if (schoolId) where.schoolId = schoolId;

        return prisma.section.findMany({
            where: {
                class: where
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

    static async deleteClass(id: string, schoolId?: string) {
        const where: any = { id };
        if (schoolId) where.schoolId = schoolId;

        const cls = await prisma.class.findFirst({ where });
        if (!cls) throw new Error('Class not found');

        return prisma.class.delete({ where: { id } });
    }

    static async deleteSection(id: string, schoolId?: string) {
        const section = await prisma.section.findFirst({
            where: {
                id,
                class: schoolId ? { schoolId } : undefined
            }
        });

        if (!section) throw new Error('Section not found');

        return prisma.section.delete({ where: { id } });
    }
}
