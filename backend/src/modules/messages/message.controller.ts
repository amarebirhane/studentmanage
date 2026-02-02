import { Response, NextFunction } from 'express';
import { MessageService } from './message.service';
import { ApiResponse } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';

export const sendMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { recipientId, subject, content } = req.body;
        const message = await MessageService.sendMessage({
            senderId: req.user?.id as string,
            recipientId,
            subject,
            content,
            schoolId: req.schoolId,
        });
        return ApiResponse.success(res, message, 'Message sent successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const getInbox = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const messages = await MessageService.getInbox(req.user?.id as string, req.schoolId);
        return ApiResponse.success(res, messages, 'Inbox messages');
    } catch (error) {
        next(error);
    }
};

export const getSentMessages = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const messages = await MessageService.getSentMessages(req.user?.id as string, req.schoolId);
        return ApiResponse.success(res, messages, 'Sent messages');
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const message = await MessageService.markAsRead(req.params.id as string, req.user?.id as string, req.schoolId);
        return ApiResponse.success(res, message, 'Message marked as read');
    } catch (error) {
        next(error);
    }
};

export const deleteMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await MessageService.deleteMessage(req.params.id as string, req.user?.id as string, req.schoolId);
        return ApiResponse.success(res, {}, 'Message deleted successfully');
    } catch (error) {
        next(error);
    }
};
