import express from 'express';
import { multerUpload } from '../../config/multer';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import { getMeController, updateMeController } from './userController';

const router = express.Router();

router.get('/me', authorizeWithRoles('user', 'admin'), getMeController);
router.patch(
  '/updateMe',
  authorizeWithRoles('user', 'admin'),
  multerUpload.single('avatar'),

  updateMeController
);

export default router;
