import express from 'express';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import { getMeController } from './userController';

const router = express.Router();

router.get('/me', authorizeWithRoles('user', 'admin'), getMeController);

export default router;
