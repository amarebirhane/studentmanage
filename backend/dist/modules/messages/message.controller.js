"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.markAsRead = exports.getSentMessages = exports.getInbox = exports.sendMessage = void 0;
const message_service_1 = require("./message.service");
const apiResponse_1 = require("../../utils/apiResponse");
const sendMessage = async (req, res, next) => {
    try {
        const { recipientId, subject, content } = req.body;
        const message = await message_service_1.MessageService.sendMessage({
            senderId: req.user.id,
            recipientId,
            subject,
            content,
            schoolId: req.schoolId,
        });
        new apiResponse_1.ApiResponse(res, 201, 'Message sent successfully', message).send();
    }
    catch (error) {
        next(error);
    }
};
exports.sendMessage = sendMessage;
const getInbox = async (req, res, next) => {
    try {
        const messages = await message_service_1.MessageService.getInbox(req.user.id, req.schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Inbox messages', messages).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getInbox = getInbox;
const getSentMessages = async (req, res, next) => {
    try {
        const messages = await message_service_1.MessageService.getSentMessages(req.user.id, req.schoolId);
        new apiResponse_1.ApiResponse(res, 200, 'Sent messages', messages).send();
    }
    catch (error) {
        next(error);
    }
};
exports.getSentMessages = getSentMessages;
const markAsRead = async (req, res, next) => {
    try {
        const message = await message_service_1.MessageService.markAsRead(req.params.id, req.user.id);
        new apiResponse_1.ApiResponse(res, 200, 'Message marked as read', message).send();
    }
    catch (error) {
        next(error);
    }
};
exports.markAsRead = markAsRead;
const deleteMessage = async (req, res, next) => {
    try {
        await message_service_1.MessageService.deleteMessage(req.params.id, req.user.id);
        new apiResponse_1.ApiResponse(res, 200, 'Message deleted successfully').send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMessage = deleteMessage;
