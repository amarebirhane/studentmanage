import { prisma } from '../../config';

export class TimetableService {
    static async createEntry(data: {
        dayOfWeek: number;
        periodNumber: number;
        subjectId: string;
        classId?: string;
        sectionId?: string;
        teacherId?: string;
        room?: string;
        schoolId?: string;
    }) {
        const { dayOfWeek, periodNumber, classId, sectionId, teacherId, room, schoolId } = data;

        // Conflict Detection: Teacher availability
        if (teacherId) {
            const teacherConflict = await prisma.timetableEntry.findFirst({
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
            const roomConflict = await prisma.timetableEntry.findFirst({
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

        return prisma.timetableEntry.create({
            data: {
                ...data,
            }
        });
    }

    static async getTimetable(filters: {
        classId?: string;
        sectionId?: string;
        teacherId?: string;
        schoolId?: string;
    }) {
        const where: any = {};
        if (filters.schoolId) where.schoolId = filters.schoolId;
        if (filters.classId) where.classId = filters.classId;
        if (filters.sectionId) where.sectionId = filters.sectionId;
        if (filters.teacherId) where.teacherId = filters.teacherId;

        return prisma.timetableEntry.findMany({
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

    static async deleteEntry(id: string, schoolId?: string) {
        const where: any = { id };
        if (schoolId) where.schoolId = schoolId;

        const entry = await prisma.timetableEntry.findFirst({ where });
        if (!entry) throw new Error('Timetable entry not found');

        return prisma.timetableEntry.delete({ where: { id } });
    }

    static async updateEntry(id: string, data: any, schoolId?: string) {
        const where: any = { id };
        if (schoolId) where.schoolId = schoolId;

        const entry = await prisma.timetableEntry.findFirst({ where });
        if (!entry) throw new Error('Timetable entry not found');

        // Note: Conflict detection should also be applied here if time/teacher/room changes
        return prisma.timetableEntry.update({
            where: { id },
            data
        });
    }
}
