import express from 'express';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import {
  deleteCommentController,
  updateCommentController,
} from './commetController';

const router = express.Router();

router.use(authorizeWithRoles('user', 'admin'));

router
  .route('/:id')
  .put(updateCommentController)
  .delete(deleteCommentController);

export default router;
