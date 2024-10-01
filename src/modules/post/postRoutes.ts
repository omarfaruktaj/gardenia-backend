import express from 'express';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import {
  createCommentController,
  getCommentByPostController,
} from '../comment/commetController';
import { voteOnPostController } from '../vote/voteControler';
import { multerUpload } from './../../config/multer';
import {
  createPostController,
  deletePostController,
  getAllPostController,
  getAPostController,
  updatePostController,
} from './postController';

const router = express.Router();

router.use(authorizeWithRoles('admin', 'user'));

router
  .route('/')
  .get(getAllPostController)
  .post(multerUpload.array('images'), createPostController);

router
  .route('/:id/comments')
  .get(getCommentByPostController)
  .post(createCommentController);

router.post('/:id/vote', voteOnPostController);

router
  .route('/:id')
  .get(getAPostController)
  .delete(deletePostController)
  .put(multerUpload.array('images'), updatePostController);

export default router;
