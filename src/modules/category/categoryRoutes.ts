import express from 'express';
import authorizeWithRoles from '../../middlewares/authorizeWithRoles';
import {
  createCategoryController,
  deleteCategoryController,
  getACategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from './categoryController';

const router = express.Router();

router
  .route('/')
  .post(authorizeWithRoles('admin'), createCategoryController)
  .get(authorizeWithRoles('user', 'admin'), getAllCategoriesController);

router
  .route('/:id')
  .put(authorizeWithRoles('admin'), updateCategoryController)
  .get(authorizeWithRoles('user', 'admin'), getACategoryController)
  .delete(authorizeWithRoles('admin'), deleteCategoryController);

export default router;
