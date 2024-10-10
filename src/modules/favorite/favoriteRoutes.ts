import { Router } from 'express';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import {
  deleteFavoriteController,
  getFavoritesByUserController,
} from './favoriteController';

const router = Router();

router.use(authorizeWithRoles('admin', 'user'));

router.route('/').get(getFavoritesByUserController);

router.route('/:id').delete(deleteFavoriteController);

export default router;
