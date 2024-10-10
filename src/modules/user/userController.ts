import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/app-error';
import APIResponse from '../../utils/APIResponse';
import {
  changeRoleService,
  deleteUserService,
  followUserService,
  getAllUserService,
  getAUser,
  getAUserWithVerificationEligible,
  getFollowersService,
  getFollowingService,
  getMeService,
  getUserActivityService,
  getVerificationStatusService,
  unfollowUserService,
  updateUserService,
  userVerifyService,
} from './userService';

export const getMeController = async (req: Request, res: Response) => {
  const me = await getMeService(String(req.user?._id));
  res.json(new APIResponse(httpStatus.OK, 'get me successfully', me));
};

export const updateMeController = async (req: Request, res: Response) => {
  // const data = JSON.parse(req.body.data);
  // data.avatar = req.file?.path;

  // const result = await UserUpdateSchema.safeParseAsync(data);

  // if (!result.success) {
  //   return next(result.error);
  // }

  const data = req.body;

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
export const getAUserWithVerificationEligibleController: RequestHandler =
  async (req, res) => {
    const userId = req.params.id;
    const userData = await getAUserWithVerificationEligible(userId);

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
    new APIResponse(httpStatus.CREATED, `You are unfollowed ${username}`, null)
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

  const { following, pagination } = await getFollowingService(
    userId,
    req.query
  );

  res.json(
    new APIResponse(httpStatus.OK, `Following get successfully`, {
      following,
      pagination,
    })
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

  const { followers, pagination } = await getFollowersService(
    userId,
    req.query
  );

  res.json(
    new APIResponse(httpStatus.OK, `Following get successfully`, {
      followers,
      pagination,
    })
  );
};

export const getVerificationStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = new mongoose.Types.ObjectId(req.params.id);

  if (!userId)
    return next(new AppError('Invalid request', httpStatus.BAD_REQUEST));

  const result = await getVerificationStatusService(userId);

  res.json(
    new APIResponse(
      httpStatus.OK,
      `Verification Status get successfully`,
      result
    )
  );
};
export const userVerifyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = new mongoose.Types.ObjectId(req.params.id);

  if (!userId)
    return next(new AppError('Invalid request', httpStatus.BAD_REQUEST));

  const result = await userVerifyService(userId);

  res.json(new APIResponse(httpStatus.OK, `Successfully verified `, result));
};

export const getUserActivityController: RequestHandler = async (_req, res) => {
  const users = await getUserActivityService();

  res.json(
    new APIResponse(httpStatus.OK, 'votes retrieved successfully', users)
  );
};

export const changeRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = new mongoose.Types.ObjectId(req.params.id);
  const data = req.body;
  console.log(data);
  if (data?.role !== 'user' && data.role !== 'admin') {
    console.log(!(data?.role === 'user') || data.role === 'admin');
    return next(
      new AppError('Role must be user or admin', httpStatus.BAD_REQUEST)
    );
  }
  const result = await changeRoleService(userId, data);

  res.json(new APIResponse(httpStatus.OK, `Role changed successfully`, result));
};
