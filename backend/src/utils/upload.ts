import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiResponse } from '../utils/apiResponse';

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'));
    }
};

// Multer configuration
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    }
});

// Upload controller
export class UploadController {
    static uploadFile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                return ApiResponse.error(res, 'No file uploaded', 400);
            }

            const fileUrl = `/uploads/${req.file.filename}`;
            return ApiResponse.success(res, { url: fileUrl }, 'File uploaded successfully', 201);
        } catch (error: any) {
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
