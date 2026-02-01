"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassService = void 0;
const config_1 = require("../../config");
class ClassService {
    static async getClasses() {
        return config_1.prisma.class.findMany({
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
        return config_1.prisma.section.findMany({
            include: {
                class: true,
                _count: {
                    select: { students: true }
                }
            },
            orderBy: { name: 'asc' },
        });
    }
    static async createClass(name, grade) {
        return config_1.prisma.class.create({ data: { name, grade } });
    }
    static async createSection(name, classId) {
        return config_1.prisma.section.create({ data: { name, classId } });
    }
    static async deleteClass(id) {
        return config_1.prisma.class.delete({ where: { id } });
    }
    static async deleteSection(id) {
        return config_1.prisma.section.delete({ where: { id } });
    }
}
exports.ClassService = ClassService;
