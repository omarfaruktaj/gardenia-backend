import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import env from '../config/env';
import AppError from '../errors/app-error';
import { TUserRoles } from '../modules/user/userInterface';
import { getAUser } from '../modules/user/userService';
import { UserType } from '../modules/user/userValidation';

declare module 'express' {
  interface Request {
    user?: UserType & { _id: Types.ObjectId };
  }
}

const authorizeWithRoles =
  (...roles: TUserRoles[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1];
    // console.log(req.headers);
    if (!token)
      return next(
        new AppError(
          'Your are not logged in! Please login.',
          httpStatus.UNAUTHORIZED
        )
      );

    const decoded = (await jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET
    )) as JwtPayload;
    const user = await getAUser('id', decoded.userId);

    if (!user) return next(new AppError('No user found', httpStatus.NOT_FOUND));
    if (user.changedPasswordAfter(decoded.iat as number)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }
    if (roles && !roles.includes(user.role))
      return next(
        new AppError(
          'You do not have permission for this route',
          httpStatus.UNAUTHORIZED
        )
      );

    req.user = user;

    next();
  };

export default authorizeWithRoles;
