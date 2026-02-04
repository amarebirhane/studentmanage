import { Router } from 'express';
import { UploadController, upload } from '../utils/upload';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Wrapper to handle multer errors
const uploadMiddleware = (req: any, res: any, next: any) => {
    upload.single('file')(req, res, (err: any) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    });
};

// Upload endpoint - protected but accessible to all authenticated users
router.post('/', protect, uploadMiddleware, UploadController.uploadFile);

export default router;
