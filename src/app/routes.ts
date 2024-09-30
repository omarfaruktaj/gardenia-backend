import express from 'express';
import authRoutes from '../modules/auth/authRotes';
import userRoues from '../modules/user/userRoues';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/users', userRoues);

export default router;
