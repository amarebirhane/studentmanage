import { Response, NextFunction } from 'express';
import { AnnouncementService } from './announcement.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';

export const createAnnouncement = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const announcement = await AnnouncementService.createAnnouncement({
            title: req.body.title,
            content: req.body.content,
            target: req.body.target,
            createdById: req.user?.id as string,
            schoolId: req.schoolId,
        });
        new ApiResponse(res, 201, 'Announcement created successfully', announcement).send();
    } catch (error) {
        next(error);
    }
};

export const getAnnouncement = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const announcement = await AnnouncementService.getAnnouncementById(req.params.id as string, req.schoolId);
        new ApiResponse(res, 200, 'Announcement details', announcement).send();
    } catch (error) {
        next(error);
    }
};

export const updateAnnouncement = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const announcement = await AnnouncementService.updateAnnouncement(
            req.params.id as string,
            req.body,
            req.user?.id as string,
            req.schoolId
        );
        new ApiResponse(res, 200, 'Announcement updated successfully', announcement).send();
    } catch (error) {
        next(error);
    }
};

export const deleteAnnouncement = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await AnnouncementService.deleteAnnouncement(req.params.id as string, req.user?.id as string, req.schoolId);
        new ApiResponse(res, 200, 'Announcement deleted successfully').send();
    } catch (error) {
        next(error);
    }
};

export const getAnnouncements = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const announcements = await AnnouncementService.getAnnouncements(
            req.schoolId,
            req.user?.role
        );
        new ApiResponse(res, 200, 'Announcements retrieved', announcements).send();
    } catch (error) {
        next(error);
    }
};
