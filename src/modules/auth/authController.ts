import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import env from '../../config/env';
import AppError from '../../errors/app-error';
import APIResponse from '../../utils/APIResponse';
import generateJWT from '../../utils/generateJWT';
import {
  changePasswordService,
  forgotPasswordService,
  refreshTokenService,
  resetPasswordService,
  signInService,
  signupService,
} from './authService';

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  username?: string | undefined;
  bio?: string | undefined;
  avatar?: string | undefined;
  isVerified?: boolean | undefined;
}

const createAndSendToken = (req: Request, res: Response, user: IUser) => {
  const accessToken = generateJWT(
    {
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      name: user.name,
      userId: String(user._id),
      isVerified: user.isVerified!,
      role: user.role!,
    },
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRE
  );
  const refreshToken = generateJWT(
    {
      userId: String(user._id),
    },
    env.REFRESH_TOKEN_SECRET,
    env.REFRESH_TOKEN_EXPIRE
  );

  res.cookie('refresh_token', refreshToken, {
    expires: new Date(
      Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const signupController: RequestHandler = async (req, res) => {
  const user = await signupService(req.body);

  const { accessToken, refreshToken } = createAndSendToken(req, res, {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    username: user.username,
  });

  res.status(httpStatus.CREATED).json(
    new APIResponse(httpStatus.CREATED, 'User registered Successfully.', {
      accessToken,
      refreshToken,
      user: user,
    })
  );
};

export const signInController: RequestHandler = async (req, res) => {
  const user = await signInService(req.body);

  const { accessToken, refreshToken } = createAndSendToken(req, res, {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    username: user.username,
  });
  res.status(httpStatus.OK).json(
    new APIResponse(httpStatus.OK, 'User signIn Successfully.', {
      accessToken,
      refreshToken,
      user,
    })
  );
};

export const signOutController: RequestHandler = async (req, res) => {
  res.cookie('refresh_token', null, {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
    secure: req.secure,
  });

  res
    .status(httpStatus.OK)
    .json(new APIResponse(httpStatus.OK, 'User signOut Successfully.', null));
};

export const forgotPasswordController: RequestHandler = async (req, res) => {
  await forgotPasswordService(req.body);

  res
    .status(httpStatus.OK)
    .json(
      new APIResponse(
        httpStatus.OK,
        'Email sent! Check your inbox for a reset link.',
        null
      )
    );
};

export const resetPasswordController: RequestHandler = async (req, res) => {
  const token = req.params.token;
  const password = req.body.password;

  const user = await resetPasswordService({ token, password });

  const { accessToken, refreshToken } = createAndSendToken(req, res, {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    username: user.username,
  });

  res.status(httpStatus.CREATED).json(
    new APIResponse(httpStatus.CREATED, 'Password reset successful.', {
      accessToken,
      refreshToken,
      user,
    })
  );
};

export const passwordChangeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { currentPassword, newPassword } = req.body;

  const userId = req.user?._id;

  if (!userId)
    return next(new AppError('You are not login.', httpStatus.UNAUTHORIZED));

  const user = await changePasswordService({
    currentPassword,
    newPassword,
    userId: String(userId),
  });

  const { accessToken, refreshToken } = createAndSendToken(req, res, {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    username: user.username,
  });

  res.status(httpStatus.CREATED).json(
    new APIResponse(httpStatus.CREATED, 'Password changed Successfully', {
      accessToken,
      refreshToken,
      user,
    })
  );
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.refresh_token || req.body.refreshToken;
  if (!token)
    return next(new AppError('UNAUTHORIZED', httpStatus.UNAUTHORIZED));

  const user = await refreshTokenService(token);

  const { accessToken, refreshToken } = createAndSendToken(req, res, {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    username: user.username,
  });
  res.status(httpStatus.CREATED).json(
    new APIResponse(httpStatus.CREATED, 'Password changed Successfully', {
      accessToken,
      refreshToken,
    })
  );
};
