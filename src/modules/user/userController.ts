import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import APIResponse from '../../utils/APIResponse';
import { updateUserService } from './userService';
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

  const user = updateUserService(String(userId!), data);

  res.json(
    new APIResponse(httpStatus.CREATED, 'User updated Successfully', user)
  );
};
