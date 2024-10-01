import express from 'express';
import authRoutes from '../modules/auth/authRotes';
import categoryRoutes from '../modules/category/categoryRoutes';
import commentRoutes from '../modules/comment/commentRoutes';
import favoriteRoutes from '../modules/favorite/favoriteRoutes';
import postRoues from '../modules/post/postRoutes';
import userRoues from '../modules/user/userRoues';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/users', userRoues);
router.use('/posts', postRoues);
router.use('/comments', commentRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/categories', categoryRoutes);

export default router;
