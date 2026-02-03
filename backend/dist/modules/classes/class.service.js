"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassService = void 0;
const config_1 = require("../../config");
class ClassService {
    static async getClasses(schoolId) {
        const where = {};
        if (schoolId)
            where.schoolId = schoolId;
        return config_1.prisma.class.findMany({
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
    static async getSections(schoolId) {
        const where = {};
        if (schoolId)
            where.schoolId = schoolId;
        return config_1.prisma.section.findMany({
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
    static async createClass(name, grade, schoolId) {
        return config_1.prisma.class.create({
            data: {
                name,
                grade,
                schoolId
            }
        });
    }
    static async createSection(name, classId, schoolId) {
        // Verify class belongs to the school
        if (schoolId) {
            const cls = await config_1.prisma.class.findFirst({
                where: { id: classId, schoolId }
            });
            if (!cls)
                throw new Error('Class not found in this school');
        }
        return config_1.prisma.section.create({
            data: {
                name,
                classId
            }
        });
    }
    static async deleteClass(id, schoolId) {
        const where = { id };
        if (schoolId)
            where.schoolId = schoolId;
        const cls = await config_1.prisma.class.findFirst({ where });
        if (!cls)
            throw new Error('Class not found');
        return config_1.prisma.class.delete({ where: { id } });
    }
    static async deleteSection(id, schoolId) {
        const section = await config_1.prisma.section.findFirst({
            where: {
                id,
                class: schoolId ? { schoolId } : undefined
            }
        });
        if (!section)
            throw new Error('Section not found');
        return config_1.prisma.section.delete({ where: { id } });
    }
}
exports.ClassService = ClassService;
