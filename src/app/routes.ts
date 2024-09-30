import express from 'express';
import authRoutes from '../modules/auth/authRotes';
import postRoues from '../modules/post/postRoutes';
import userRoues from '../modules/user/userRoues';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/users', userRoues);
router.use('/posts', postRoues);

export default router;
