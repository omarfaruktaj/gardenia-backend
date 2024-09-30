import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import env from '../../config/env';
import AppError from '../../errors/app-error';
import APIResponse from '../../utils/APIResponse';
import generateJWT from '../../utils/generateJWT';
import { USER_ROLE } from '../user/userConstants';
import {
  changePasswordService,
  forgotPasswordService,
  refreshTokenService,
  resetPasswordService,
  signInService,
  signupService,
} from './authService';

export const signupController: RequestHandler = async (req, res) => {
  const user = await signupService(req.body);

  const accessToken = generateJWT(
    {
      name: user.name,
      userId: String(user._id),
      role: user?.role || USER_ROLE.user,
    },
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRE
  );
  const refreshToken = generateJWT(
    {
      name: user.name,
      userId: String(user._id),
      role: user?.role || USER_ROLE.user,
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

  res.json(
    new APIResponse(httpStatus.CREATED, 'User registered Successfully.', {
      accessToken,
      refreshToken,
      user: user,
    })
  );
};
export const signInController: RequestHandler = async (req, res) => {
  const user = await signInService(req.body);

  const accessToken = generateJWT(
    {
      name: user.name,
      userId: String(user._id),
      role: user?.role || USER_ROLE.user,
    },
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRE
  );
  const refreshToken = generateJWT(
    {
      name: user.name,
      userId: String(user._id),
      role: user?.role || USER_ROLE.user,
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

  res.json(
    new APIResponse(httpStatus.CREATED, 'User signIn Successfully.', {
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

  res.json(
    new APIResponse(httpStatus.CREATED, 'User signOut Successfully.', null)
  );
};

export const forgotPasswordController: RequestHandler = async (req, res) => {
  await forgotPasswordService(req.body);

  res.json(
    new APIResponse(
      httpStatus.CREATED,
      'Email sent Please check your email',
      null
    )
  );
};

export const resetPasswordController: RequestHandler = async (req, res) => {
  const token = req.params.token;
  const password = req.body.password;

  const user = await resetPasswordService({ token, password });

  const accessToken = generateJWT(
    {
      name: user.name,
      userId: String(user._id),
      role: user?.role || USER_ROLE.user,
    },
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRE
  );
  const refreshToken = generateJWT(
    {
      name: user.name,
      userId: String(user._id),
      role: user?.role || USER_ROLE.user,
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

  res.json(
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

  const accessToken = generateJWT(
    {
      name: user.name,
      userId: String(user._id),
      role: user?.role || USER_ROLE.user,
    },
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRE
  );
  const refreshToken = generateJWT(
    {
      name: user.name,
      userId: String(user._id),
      role: user?.role || USER_ROLE.user,
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

  res.json(
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
  const token = req.cookies.refresh_token;

  if (!token)
    return next(new AppError('UNAUTHORIZED', httpStatus.UNAUTHORIZED));

  const user = await refreshTokenService(token);

  const accessToken = generateJWT(
    {
      name: user.name,
      userId: String(user._id),
      role: user?.role || USER_ROLE.user,
    },
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRE
  );
  const refreshToken = generateJWT(
    {
      name: user.name,
      userId: String(user._id),
      role: user?.role || USER_ROLE.user,
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

  res.json(
    new APIResponse(httpStatus.CREATED, 'Password changed Successfully', {
      accessToken,
      refreshToken,
    })
  );
};
