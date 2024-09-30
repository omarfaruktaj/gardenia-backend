import { Model } from 'mongoose';
import { USER_ROLE } from './userConstants';
import { UserType } from './userValidation';

export interface IUserMethods {
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}
export interface UserModel extends Model<UserType, object, IUserMethods> {
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  findDeleted(): Promise<UserType>;
}
export type TUserRoles = keyof typeof USER_ROLE;
