import { prisma } from '../../config';

export class SearchService {
    /**
     * Global search across multiple modules
     */
    static async globalSearch(query: string, schoolId: string) {
        const decodedQuery = decodeURIComponent(query);

        const [students, teachers, classes] = await Promise.all([
            // Search Students
            prisma.studentProfile.findMany({
                where: {
                    schoolId,
                    OR: [
                        { user: { firstName: { contains: decodedQuery, mode: 'insensitive' } } },
                        { user: { lastName: { contains: decodedQuery, mode: 'insensitive' } } },
                        { enrollmentNo: { contains: decodedQuery, mode: 'insensitive' } }
                    ]
                },
                include: {
                    user: { select: { firstName: true, lastName: true, avatarUrl: true } },
                    class: { select: { name: true } }
                },
                take: 5
            }),
            // Search Teachers
            prisma.teacherProfile.findMany({
                where: {
                    schoolId,
                    OR: [
                        { user: { firstName: { contains: decodedQuery, mode: 'insensitive' } } },
                        { user: { lastName: { contains: decodedQuery, mode: 'insensitive' } } },
                        { employeeId: { contains: decodedQuery, mode: 'insensitive' } }
                    ]
                },
                include: {
                    user: { select: { firstName: true, lastName: true, avatarUrl: true } }
                },
                take: 5
            }),
            // Search Classes
            prisma.class.findMany({
                where: {
                    schoolId,
                    name: { contains: decodedQuery, mode: 'insensitive' }
                },
                take: 5
            })
        ]);

        return {
            students: students.map(s => ({
                id: s.id,
                type: 'student',
                title: `${s.user.firstName} ${s.user.lastName}`,
                subtitle: `ID: ${s.enrollmentNo} • ${s.class?.name || 'No Class'}`,
                avatar: s.user.avatarUrl,
                link: `/dashboard/admin/students/view/${s.id}`
            })),
            teachers: teachers.map(t => ({
                id: t.id,
                type: 'teacher',
                title: `${t.user.firstName} ${t.user.lastName}`,
                subtitle: `ID: ${t.employeeId || 'N/A'}`,
                avatar: t.user.avatarUrl,
                link: `/dashboard/admin/teachers/view/${t.id}`
            })),
            classes: classes.map(c => ({
                id: c.id,
                type: 'class',
                title: c.name,
                subtitle: `Grade: ${c.grade}`,
                link: `/dashboard/admin/classes`
            }))
        };
    }
}
