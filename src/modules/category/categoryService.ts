import httpStatus from 'http-status';
import { Pagination, QueryString } from '../../@types';
import ApiFeatures from '../../builder/APIFeature';
import AppError from '../../errors/app-error';
import Category from './categoryModel';
import { CategoryType, CategoryUpdateSchemaType } from './categoryValidation';

export const createCategoryService = async (data: CategoryType) => {
  const newCategory = new Category(data);
  await newCategory.save();
  return newCategory;
};

export const updateCategoryService = async (
  id: string,
  data: CategoryUpdateSchemaType
) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError('No category found.', httpStatus.NOT_FOUND);

  const updatedCategory = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return updatedCategory;
};

export const getACategoryService = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError('No category found.', httpStatus.NOT_FOUND);

  return category;
};

export const getAllCategoriesService = async (query: QueryString) => {
  const features = new ApiFeatures<CategoryType>(Category.find(), query)
    .sort()
    .limitFields()
    .paginate();

  const count = await Category.countDocuments();
  const total = count || 0;
  const totalPage = Math.ceil(total / (Number(query.limit) || 10));
  const pagination: Pagination = {
    totalPage,
    total,
    limit: Number(query.limit) || 10,
    page: Number(query.page) || 1,
  };

  if (pagination.page < totalPage) {
    pagination.next = pagination.page + 1;
  }
  if (pagination.page > 1) {
    pagination.prev = pagination.page - 1;
  }

  const categories = await features.query;
  return {
    categories,
    pagination,
  };
};

export const deleteACategoryService = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError('No category found', httpStatus.NOT_FOUND);

  const deletedCategory = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return deletedCategory;
};
