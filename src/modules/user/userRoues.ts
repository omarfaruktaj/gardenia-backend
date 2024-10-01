import express from 'express';
import { multerUpload } from '../../config/multer';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import {
  deleteUserController,
  followUserController,
  getAllUserController,
  getAUserController,
  getFollowersController,
  getFollowingController,
  getMeController,
  getVerificationStatusController,
  unfollowUserController,
  updateMeController,
  userVerifyController,
} from './userController';

const router = express.Router();

// User's own data
router.get('/me', authorizeWithRoles('user', 'admin'), getMeController);
router.patch(
  '/updateMe',
  authorizeWithRoles('user', 'admin'),
  multerUpload.single('avatar'),
  updateMeController
);

// Follow/Unfollow actions
router.post(
  '/:id/follow',
  authorizeWithRoles('user', 'admin'),
  followUserController
);
router.delete(
  '/:id/unfollow',
  authorizeWithRoles('user', 'admin'),
  unfollowUserController
); // Changed to DELETE

// Followers/Following actions
router.get(
  '/:id/followers',
  authorizeWithRoles('user', 'admin'),
  getFollowersController
);
router.get(
  '/:id/following',
  authorizeWithRoles('user', 'admin'),
  getFollowingController
);

// Varification actions
router.get(
  '/id/verification-status',
  authorizeWithRoles('user', 'admin'),
  getVerificationStatusController
);
router.get(
  '/id/verify',
  authorizeWithRoles('user', 'admin'),
  userVerifyController
);

// Admin-only actions
router.use(authorizeWithRoles('admin'));
router.get('/', getAllUserController);
router.route('/:id').get(getAUserController).delete(deleteUserController);

export default router;
