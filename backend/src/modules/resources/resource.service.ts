import { prisma } from '../../config';
import { ApiError } from '../../middlewares/error.middleware';

export class ResourceService {
    static async createResource(data: any, userId: string, schoolId: string) {
        const { subjectId, classId, ...rest } = data;
        return prisma.resource.create({
            data: {
                ...rest,
                subjectId: subjectId || null,
                classId: classId || null,
                uploadedById: userId,
                schoolId
            },
            include: {
                uploadedBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
    }

    static async getResources(filters: any, schoolId: string) {
        const { classId, subjectId, type } = filters;

        return prisma.resource.findMany({
            where: {
                schoolId,
                ...(classId && { classId }),
                ...(subjectId && { subjectId }),
                ...(type && { type })
            },
            include: {
                uploadedBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                subject: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    static async deleteResource(id: string, schoolId: string) {
        const resource = await prisma.resource.findUnique({
            where: { id }
        });

        if (!resource) {
            throw new ApiError(404, 'Resource not found');
        }

        if (resource.schoolId !== schoolId) {
            throw new ApiError(403, 'Not authorized to access this resource');
        }

        return prisma.resource.delete({
            where: { id }
        });
    }
}
