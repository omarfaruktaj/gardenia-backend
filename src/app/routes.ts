import express from 'express';
import authRoutes from '../modules/auth/authRotes';
import categoryRoutes from '../modules/category/categoryRoutes';
import commentRoutes from '../modules/comment/commentRoutes';
import favoriteRoutes from '../modules/favorite/favoriteRoutes';
import paymentRoutes from '../modules/payment/paymentRotes';
import postRoues from '../modules/post/postRoutes';
import quoteRoues from '../modules/quote/quoteRoutes';
import userRoues from '../modules/user/userRoues';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/users', userRoues);
router.use('/posts', postRoues);
router.use('/comments', commentRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/categories', categoryRoutes);
router.use('/quotes', quoteRoues);
router.use('/payments', paymentRoutes);

export default router;
