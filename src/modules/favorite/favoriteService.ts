import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { Pagination, QueryString } from '../../@types';
import ApiFeatures from '../../builder/APIFeature';
import AppError from '../../errors/app-error';
import Favorite from './favoriteModel';
import { FavoriteType } from './favoriteValidation';

export const createFavoriteService = async (data: FavoriteType) => {
  const newFavorite = new Favorite(data);
  await newFavorite.save();
  return newFavorite;
};

export const getAllFavoritesByUserService = async (
  userId: Types.ObjectId,
  query: QueryString
) => {
  const features = new ApiFeatures<FavoriteType>(
    Favorite.find({ user: userId }),
    query
  )
    .sort()
    .limitFields()
    .paginate();

  const count = await Favorite.countDocuments({ user: userId });
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

  const comments = await features.query;
  return {
    comments,
    pagination,
  };
};

export const deleteAFavoriteService = async (id: string) => {
  const favorite = await Favorite.findById(id);
  if (!favorite) {
    throw new AppError('No Favorite found', httpStatus.NOT_FOUND);
  }

  const deletedFavorite = await Favorite.findByIdAndDelete(id);
  return deletedFavorite;
};
