import httpStatus from 'http-status';
import AppError from '../../errors/app-error';
import { generateUniqueUsername } from '../../lib/generateUniqueUsername';
import User from '../user/userModel';
import { createUser, getAUser } from '../user/userService';
import { SignInSchemaType, UserType } from '../user/userValidation';

export const signupService = async ({ name, email, password }: UserType) => {
  const existedUser = await getAUser('email', email);

  if (existedUser) throw new AppError('Use already exit.', httpStatus.CONFLICT);

  const baseUsername = name.split(' ').join('');
  const username = await generateUniqueUsername(baseUsername);

  const user = await createUser({ name, email, password, username });

  return user;
};
export const signInService = async ({ email, password }: SignInSchemaType) => {
  const user = await getAUser('email', email).select('+password');

  if (!user || !(await User.correctPassword(password, user.password)))
    throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);

  return user;
};
