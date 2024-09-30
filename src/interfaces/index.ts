import { Types } from 'mongoose';
import { UserType } from '../modules/user/userValidation';

declare module 'express' {
  interface Request {
    user?: UserType & { _id: Types.ObjectId };
  }
}
