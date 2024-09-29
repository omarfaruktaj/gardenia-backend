import httpStatus from 'http-status';
import AppError from '../../errors/app-error';
import { generateUniqueUsername } from '../../lib/generateUniqueUsername';
import { createUser, getAUser } from '../user/userService';
import { UserType } from '../user/userValidation';

export const signupService = async ({ name, email, password }: UserType) => {
  const existedUser = await getAUser('email', email);

  if (existedUser) throw new AppError('Use already exit.', httpStatus.CONFLICT);

  const baseUsername = name.split(' ').join('');
  const username = await generateUniqueUsername(baseUsername);

  const user = await createUser({ name, email, password, username });

  return user;
};
