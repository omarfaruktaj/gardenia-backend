import User from './userModel';
import { UserType } from './userValidation';

export const createUser = ({ name, email, password, username }: UserType) => {
  return User.create({ name, email, password, username });
};

export const getAUser = (key: string, value: string) => {
  if (key === 'id') {
    return User.findById(value);
  }

  return User.findOne({ [key]: value });
};
