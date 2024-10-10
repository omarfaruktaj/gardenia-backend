import express from 'express';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import validateRequest from '../../middlewares/validateRequest';
import { getPostsByUserController } from '../post/postController';
import {
  changeRoleController,
  deleteUserController,
  followUserController,
  getAllUserController,
  getAUserController,
  getAUserWithVerificationEligibleController,
  getFollowersController,
  getFollowingController,
  getMeController,
  getUserActivityController,
  getVerificationStatusController,
  unfollowUserController,
  updateMeController,
  userVerifyController,
} from './userController';
import { UserUpdateSchema } from './userValidation';

const router = express.Router();

// User's own data
router.get('/me', authorizeWithRoles('user', 'admin'), getMeController);
router.patch(
  '/updateMe',
  authorizeWithRoles('user', 'admin'),
  validateRequest(UserUpdateSchema),
  // multerUpload.single('avatar'),
  updateMeController
);

router.get('/user-activity', getUserActivityController);
router.get('/:id/status', getAUserWithVerificationEligibleController);

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

// user
router.get(
  '/:id/posts',
  authorizeWithRoles('user', 'admin'),
  getPostsByUserController
);

// Varification actions
router.get(
  '/:id/verification-status',
  authorizeWithRoles('user', 'admin'),
  getVerificationStatusController
);
router.get(
  '/:id/verify',
  authorizeWithRoles('user', 'admin'),
  userVerifyController
);

// Admin-only actions
router.get('/', authorizeWithRoles('admin'), getAllUserController);
router
  .route('/:id')
  .patch(authorizeWithRoles('admin'), changeRoleController)
  .get(authorizeWithRoles('user', 'admin'), getAUserController)
  .delete(authorizeWithRoles('admin'), deleteUserController);

export default router;
