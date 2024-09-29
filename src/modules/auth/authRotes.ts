import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserSchema } from '../user/userValidation';
import { signupController } from './authController';

const router = express.Router();

router.post('/signup', validateRequest(UserSchema), signupController);

export default router;
