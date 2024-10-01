import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import APIResponse from '../../utils/APIResponse';
import {
  createCategoryService,
  deleteACategoryService,
  getACategoryService,
  getAllCategoriesService,
  updateCategoryService,
} from './categoryService';
import { CategorySchema, CategoryUpdateSchema } from './categoryValidation';

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  const result = await CategorySchema.safeParseAsync(data);
  if (!result.success) return next(result.error);

  const category = await createCategoryService(result.data);

  res
    .status(httpStatus.CREATED)
    .json(
      new APIResponse(
        httpStatus.CREATED,
        'Category added successfully',
        category
      )
    );
};

export const updateCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categoryId = req.params.id;
  const data = req.body;

  const result = await CategoryUpdateSchema.safeParseAsync(data);
  if (!result.success) return next(result.error);

  const category = await updateCategoryService(categoryId, result.data).catch(
    next
  );

  res
    .status(httpStatus.OK)
    .json(
      new APIResponse(httpStatus.OK, 'Category updated successfully', category)
    );
};

export const getAllCategoriesController = async (
  req: Request,
  res: Response
) => {
  const { categories, pagination } = await getAllCategoriesService(req.query);

  res.json(
    new APIResponse(
      httpStatus.OK,
      'Categories retrieved successfully',
      categories,
      pagination
    )
  );
};

export const getACategoryController = async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  const category = await getACategoryService(categoryId);

  res.json(
    new APIResponse(httpStatus.OK, 'Category retrieved successfully', category)
  );
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  const category = await deleteACategoryService(categoryId);

  res
    .status(httpStatus.OK)
    .json(
      new APIResponse(httpStatus.OK, 'Category deleted successfully', category)
    );
};
