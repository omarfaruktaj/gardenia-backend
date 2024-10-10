import express from 'express';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import optionalJWTVerify from '../../middlewares/optionalJWTVerify';
import validateRequest from '../../middlewares/validateRequest';
import {
  createCommentController,
  getCommentByPostController,
} from '../comment/commetController';
import { toggleFavoriteController } from '../favorite/favoriteController';
import {
  getMonthlyVotesController,
  voteOnPostController,
} from '../vote/voteControler';
import {
  createPostController,
  deletePostController,
  feedController,
  getAllPostAdminController,
  getAPostAdminController,
  getAPostController,
  getMonthlyPostsController,
  updatePostController,
} from './postController';
import { PostSchema, PostUpdateSchema } from './postValidation';

const router = express.Router();

router.get('/feed', optionalJWTVerify, feedController);

router.use(authorizeWithRoles('admin', 'user'));

router.get('/monthly-posts', getMonthlyPostsController);
router.get('/monthly-votes', getMonthlyVotesController);

router.route('/').get(getAllPostAdminController).post(
  // multerUpload.array('images'),
  validateRequest(PostSchema),
  createPostController
);

router
  .route('/:id/comments')
  .get(getCommentByPostController)
  .post(createCommentController);

router.route('/:id/favorite').post(toggleFavoriteController);

router.post('/:id/vote', voteOnPostController);

router.route('/:id').get(getAPostController).delete(deletePostController).put(
  // multerUpload.array('images'),
  validateRequest(PostUpdateSchema),
  updatePostController
);

router.get('/:id/admin', getAPostAdminController);

export default router;
