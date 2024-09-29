import express from 'express';
import authRoutes from '../modules/auth/authRotes';

const router = express.Router();
router.use('/auth', authRoutes);

export default router;
