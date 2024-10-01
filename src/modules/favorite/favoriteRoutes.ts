import { Router } from 'express';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import {
  createFavoriteController,
  deleteFavoriteController,
  getFavoritesByUserController,
} from './favoriteController';

const router = Router();

router.use(authorizeWithRoles('admin', 'user'));
router
  .route('/')
  .get(getFavoritesByUserController)
  .post(createFavoriteController);

router.delete('/:id');

router.route('/:id').delete(deleteFavoriteController);

export default router;
