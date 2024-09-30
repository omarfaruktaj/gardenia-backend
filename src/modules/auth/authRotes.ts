import express from 'express';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import validateRequest from '../../middlewares/validateRequest';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  UserSchema,
} from '../user/userValidation';
import {
  forgotPasswordController,
  passwordChangeController,
  resetPasswordController,
  signInController,
  signOutController,
  signupController,
} from './authController';

const router = express.Router();

router.post('/signup', validateRequest(UserSchema), signupController);
router.post('/signIn', validateRequest(signInSchema), signInController);
router.get('/signOut', signOutController);
router.post(
  '/forgotPassword',
  validateRequest(forgotPasswordSchema),
  forgotPasswordController
);

router.patch(
  '/resetPassword/:token',
  validateRequest(resetPasswordSchema),
  resetPasswordController
);

router.patch(
  '/changePassword',
  authorizeWithRoles('admin', 'user'),
  validateRequest(changePasswordSchema),
  passwordChangeController
);

export default router;
