import { prisma } from '../../config';

export class ClassService {
    static async getClasses() {
        return prisma.class.findMany({
            include: {
                sections: true,
                _count: {
                    select: { students: true }
                }
            },
            orderBy: { name: 'asc' },
        });
    }

    static async getSections() {
        return prisma.section.findMany({
            include: {
                class: true,
                _count: {
                    select: { students: true }
                }
            },
            orderBy: { name: 'asc' },
        });
    }

    static async createClass(name: string) {
        return prisma.class.create({ data: { name } });
    }

    static async createSection(name: string, classId: string) {
        return prisma.section.create({ data: { name, classId } });
    }

    static async deleteClass(id: string) {
        return prisma.class.delete({ where: { id } });
    }

    static async deleteSection(id: string) {
        return prisma.section.delete({ where: { id } });
    }
}
