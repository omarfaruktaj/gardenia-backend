import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import env from '../../config/env';
import APIResponse from '../../utils/APIResponse';
import generateJWT from '../../utils/generateJWT';
import { USER_ROLE } from '../user/userConstants';
import { signupService } from './authService';

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
