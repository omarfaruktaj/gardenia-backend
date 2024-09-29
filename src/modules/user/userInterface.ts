import { Model } from 'mongoose';
import { UserType } from './userValidation';

export interface UserModel extends Model<UserType> {
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}
