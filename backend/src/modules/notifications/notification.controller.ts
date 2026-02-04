import { Response } from 'express';
import { NotificationService } from './notification.service';
import { ApiResponse } from '../../utils/apiResponse';

export class NotificationController {
    /**
     * Get all notifications for current user
     */
    static async getMyNotifications(req: any, res: Response) {
        try {
            const notifications = await NotificationService.getUserNotifications(req.user.id);
            return ApiResponse.success(res, notifications, 'Notifications retrieved');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * Mark a notification as read
     */
    static async markAsRead(req: any, res: Response) {
        try {
            const notification = await NotificationService.markAsRead(req.params.id);
            return ApiResponse.success(res, notification, 'Notification marked as read');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * Mark all notifications as read
     */
    static async markAllAsRead(req: any, res: Response) {
        try {
            await NotificationService.markAllAsRead(req.user.id);
            return ApiResponse.success(res, null, 'All notifications marked as read');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}
