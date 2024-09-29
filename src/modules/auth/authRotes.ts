import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { signInSchema, UserSchema } from '../user/userValidation';
import { signInController, signupController } from './authController';

const router = express.Router();

router.post('/signup', validateRequest(UserSchema), signupController);
router.post('/login', validateRequest(signInSchema), signInController);

export default router;
