import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/app-error';
import APIResponse from '../../utils/APIResponse';
import {
  deleteAFavoriteService,
  getAllFavoritesByUserService,
  toggleFavoriteService,
} from './favoriteService';
import { FavoriteSchema } from './favoriteValidation';

export const toggleFavoriteController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = String(req.user?._id);
  const postId = req.params.id;

  const data = { post: postId, user: userId };
  const result = await FavoriteSchema.safeParseAsync(data);

  if (!result.success) {
    return next(new AppError(result.error.message, httpStatus.BAD_REQUEST));
  }

  const favorite = await toggleFavoriteService(result.data);
  res
    .status(httpStatus.CREATED)
    .json(
      new APIResponse(
        httpStatus.CREATED,
        'Favorite added successfully',
        favorite
      )
    );
};

export const deleteFavoriteController = async (req: Request, res: Response) => {
  const favoriteId = req.params.id;

  const favorite = await deleteAFavoriteService(favoriteId);
  res
    .status(httpStatus.OK)
    .json(
      new APIResponse(httpStatus.OK, 'Favorite deleted successfully', favorite)
    );
};

export const getFavoritesByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(
      new AppError('User not authenticated', httpStatus.UNAUTHORIZED)
    );
  }

  const { favorites, pagination } = await getAllFavoritesByUserService(
    userId,
    req.query
  );
  res.json(
    new APIResponse(
      httpStatus.OK,
      'Favorites retrieved successfully',
      favorites,
      pagination
    )
  );
};
