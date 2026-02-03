"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimetableService = void 0;
const config_1 = require("../../config");
class TimetableService {
    static async createEntry(data) {
        const { dayOfWeek, periodNumber, classId, sectionId, teacherId, room, schoolId } = data;
        // Conflict Detection: Teacher availability
        if (teacherId) {
            const teacherConflict = await config_1.prisma.timetableEntry.findFirst({
                where: {
                    dayOfWeek,
                    periodNumber,
                    teacherId,
                    schoolId,
                }
            });
            if (teacherConflict) {
                throw new Error(`Teacher is already assigned to a class in period ${periodNumber} on day ${dayOfWeek}`);
            }
        }
        // Conflict Detection: Room availability
        if (room) {
            const roomConflict = await config_1.prisma.timetableEntry.findFirst({
                where: {
                    dayOfWeek,
                    periodNumber,
                    room,
                    schoolId,
                }
            });
            if (roomConflict) {
                throw new Error(`Room ${room} is already occupied in period ${periodNumber} on day ${dayOfWeek}`);
            }
        }
        return config_1.prisma.timetableEntry.create({
            data: {
                ...data,
            }
        });
    }
    static async getTimetable(filters) {
        const where = {};
        if (filters.schoolId)
            where.schoolId = filters.schoolId;
        if (filters.classId)
            where.classId = filters.classId;
        if (filters.sectionId)
            where.sectionId = filters.sectionId;
        if (filters.teacherId)
            where.teacherId = filters.teacherId;
        return config_1.prisma.timetableEntry.findMany({
            where,
            include: {
                class: true,
                section: true,
                teacher: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        }
                    }
                }
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { periodNumber: 'asc' }
            ]
        });
    }
    static async deleteEntry(id, schoolId) {
        const where = { id };
        if (schoolId)
            where.schoolId = schoolId;
        const entry = await config_1.prisma.timetableEntry.findFirst({ where });
        if (!entry)
            throw new Error('Timetable entry not found');
        return config_1.prisma.timetableEntry.delete({ where: { id } });
    }
    static async updateEntry(id, data, schoolId) {
        const where = { id };
        if (schoolId)
            where.schoolId = schoolId;
        const entry = await config_1.prisma.timetableEntry.findFirst({ where });
        if (!entry)
            throw new Error('Timetable entry not found');
        // Note: Conflict detection should also be applied here if time/teacher/room changes
        return config_1.prisma.timetableEntry.update({
            where: { id },
            data
        });
    }
}
exports.TimetableService = TimetableService;
