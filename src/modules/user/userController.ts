import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/app-error';
import APIResponse from '../../utils/APIResponse';
import {
  deleteUserService,
  followUserService,
  getAllUserService,
  getAUser,
  getFollowersService,
  getFollowingService,
  unfollowUserService,
  updateUserService,
} from './userService';
import { UserUpdateSchema } from './userValidation';

export const getMeController = async (req: Request, res: Response) => {
  res.json(new APIResponse(httpStatus.OK, 'get me successfully', req.user));
};

export const updateMeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = JSON.parse(req.body.data);
  data.avatar = req.file?.path;

  const result = await UserUpdateSchema.safeParseAsync(data);

  if (!result.success) {
    return next(result.error);
  }

  const userId = req.user?._id;

  const user = await updateUserService(String(userId!), data);

  res.json(
    new APIResponse(httpStatus.CREATED, 'User updated Successfully', user)
  );
};

export const getAllUserController: RequestHandler = async (req, res) => {
  const userData = await getAllUserService(req.query);

  res
    .status(httpStatus.OK)
    .json(
      new APIResponse(
        httpStatus.OK,
        'User retrieved successfully',
        userData.users,
        userData.pagination
      )
    );
};
export const getAUserController: RequestHandler = async (req, res, next) => {
  const userId = req.params.id;
  const userData = await getAUser('id', userId);

  if (!userData)
    return next(new AppError('No user found', httpStatus.NOT_FOUND));

  res
    .status(httpStatus.OK)
    .json(
      new APIResponse(httpStatus.OK, 'User retrieved successfully', userData)
    );
};
export const deleteUserController: RequestHandler = async (req, res) => {
  const userId = req.params.id;

  const deletedUser = await deleteUserService(userId);

  res
    .status(httpStatus.OK)
    .json(
      new APIResponse(httpStatus.OK, 'User deleted successfully', deletedUser)
    );
};

export const followUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = new mongoose.Types.ObjectId(req.params.id);
  const currentUserId = req.user?._id;

  if (!userId || !currentUserId)
    return next(new AppError('Invalid request', httpStatus.BAD_REQUEST));

  const username = await followUserService(currentUserId, userId);

  res.json(
    new APIResponse(
      httpStatus.CREATED,
      `You are now following ${username}`,
      null
    )
  );
};
export const unfollowUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = new mongoose.Types.ObjectId(req.params.id);
  const currentUserId = req.user?._id;

  if (!userId || !currentUserId)
    return next(new AppError('Invalid request', httpStatus.BAD_REQUEST));

  const username = await unfollowUserService(currentUserId, userId);

  res.json(
    new APIResponse(
      httpStatus.CREATED,
      `You are now unfollowed ${username}`,
      null
    )
  );
};

export const getFollowingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = new mongoose.Types.ObjectId(req.params.id);

  if (!userId)
    return next(new AppError('Invalid request', httpStatus.BAD_REQUEST));

  const following = await getFollowingService(userId);

  res.json(
    new APIResponse(httpStatus.OK, `followinds get successfully`, following)
  );
};
export const getFollowersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = new mongoose.Types.ObjectId(req.params.id);

  if (!userId)
    return next(new AppError('Invalid request', httpStatus.BAD_REQUEST));

  const followers = await getFollowersService(userId);

  res.json(
    new APIResponse(httpStatus.OK, `Following get successfully`, followers)
  );
};
