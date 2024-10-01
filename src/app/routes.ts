import express from 'express';
import authRoutes from '../modules/auth/authRotes';
import commentRoutes from '../modules/comment/commentRoutes';
import postRoues from '../modules/post/postRoutes';
import userRoues from '../modules/user/userRoues';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/users', userRoues);
router.use('/posts', postRoues);
router.use('/comments', commentRoutes);

export default router;
