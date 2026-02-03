import { Router } from 'express';
import { UploadController, upload } from '../utils/upload';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Upload endpoint - protected but accessible to all authenticated users
router.post('/', protect, upload.single('file'), UploadController.uploadFile);

export default router;
