import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { Pagination, QueryString } from '../../@types';
import ApiFeatures from '../../builder/APIFeature';
import AppError from '../../errors/app-error';
import Favorite from './favoriteModel';
import { FavoriteType } from './favoriteValidation';

export const toggleFavoriteService = async (data: FavoriteType) => {
  const existedFavorite = await Favorite.findOne({
    user: data.user,
    post: data.post,
  });

  if (existedFavorite) {
    return Favorite.findByIdAndDelete(existedFavorite._id, { new: true });
  } else {
    const newFavorite = new Favorite(data);

    return newFavorite.save();
  }
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

  const favorites = await features.query
    .populate({
      path: 'post',
      populate: [
        {
          path: 'author',
        },
        {
          path: 'category',
        },
        {
          path: 'comments',
          select: '_id',
        },
      ],
    })
    .select('-_id -user -createdAt -updatedAt');

  console.log(favorites);
  return {
    favorites,
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
