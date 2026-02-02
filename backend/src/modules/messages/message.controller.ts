import { Request, Response, NextFunction } from 'express';
import { MessageService } from './message.service';
import { ApiResponse } from '../../utils/apiResponse';

export const sendMessage = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { recipientId, subject, content } = req.body;
        const message = await MessageService.sendMessage({
            senderId: req.user.id,
            recipientId,
            subject,
            content,
            schoolId: req.schoolId,
        });
        new ApiResponse(res, 201, 'Message sent successfully', message).send();
    } catch (error) {
        next(error);
    }
};

export const getInbox = async (req: any, res: Response, next: NextFunction) => {
    try {
        const messages = await MessageService.getInbox(req.user.id, req.schoolId);
        new ApiResponse(res, 200, 'Inbox messages', messages).send();
    } catch (error) {
        next(error);
    }
};

export const getSentMessages = async (req: any, res: Response, next: NextFunction) => {
    try {
        const messages = await MessageService.getSentMessages(req.user.id, req.schoolId);
        new ApiResponse(res, 200, 'Sent messages', messages).send();
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req: any, res: Response, next: NextFunction) => {
    try {
        const message = await MessageService.markAsRead(req.params.id, req.user.id);
        new ApiResponse(res, 200, 'Message marked as read', message).send();
    } catch (error) {
        next(error);
    }
};

export const deleteMessage = async (req: any, res: Response, next: NextFunction) => {
    try {
        await MessageService.deleteMessage(req.params.id, req.user.id);
        new ApiResponse(res, 200, 'Message deleted successfully').send();
    } catch (error) {
        next(error);
    }
};
