import { Router } from 'express';
import { SearchController } from './search.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', SearchController.search);

export default router;
