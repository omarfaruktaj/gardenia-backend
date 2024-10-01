import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/app-error';
import APIResponse from '../../utils/APIResponse';
import {
  createFavoriteService,
  deleteAFavoriteService,
  getAllFavoritesByUserService,
} from './favoriteService';
import { FavoriteSchema } from './favoriteValidation';

export const createFavoriteController = async (
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

  const data = { ...req.body, user: userId };
  const result = await FavoriteSchema.safeParseAsync(data);

  if (!result.success) {
    return next(new AppError(result.error.message, httpStatus.BAD_REQUEST));
  }

  const favorite = await createFavoriteService(result.data);
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

  const { comments, pagination } = await getAllFavoritesByUserService(
    userId,
    req.query
  );
  res.json(
    new APIResponse(
      httpStatus.OK,
      'Favorites retrieved successfully',
      comments,
      pagination
    )
  );
};
