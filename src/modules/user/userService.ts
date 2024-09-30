import httpStatus from 'http-status';
import AppError from '../../errors/app-error';
import User from './userModel';
import { UserType, UserUpdateType } from './userValidation';

export const createUser = ({ name, email, password, username }: UserType) => {
  return User.create({ name, email, password, username });
};

export const getAUser = (key: string, value: string) => {
  if (key === 'id') {
    return User.findById(value);
  }

  return User.findOne({ [key]: value });
};

export const updateUserService = async (
  userId: string,
  data: UserUpdateType
) => {
  console.log(userId, data);
  const existedUsername = await User.findOne({ username: data.username });

  if (existedUsername)
    throw new AppError('Username already exist.', httpStatus.CONFLICT);

  const user = await User.findByIdAndUpdate(userId, data);

  return user;
};
