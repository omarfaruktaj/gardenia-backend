import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import env from '../config/env';
import AppError from '../errors/app-error';
import { getAUser } from '../modules/user/userService';
import { UserType } from '../modules/user/userValidation';

declare module 'express' {
  interface Request {
    user?: UserType & { _id: Types.ObjectId };
  }
}

const optionalJWTVerify = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return next();

  const decoded = (await jwt.verify(
    token,
    env.ACCESS_TOKEN_SECRET
  )) as JwtPayload;
  const user = await getAUser('id', decoded.userId);

  if (!user) return next(new AppError('No user found', httpStatus.NOT_FOUND));

  req.user = user;

  next();
};

export default optionalJWTVerify;
