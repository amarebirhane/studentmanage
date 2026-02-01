import { Router } from 'express';
import { UserController } from './user.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect, authorize('ADMIN'));

router.route('/')
    .get(UserController.getUsers);

router.route('/:id')
    .get(UserController.getUserById)
    .put(UserController.updateUser)
    .delete(UserController.deleteUser);

export default router;
