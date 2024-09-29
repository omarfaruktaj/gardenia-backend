import { model, Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { UserType } from './userValidation';

const userSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      minlength: [2, 'Name must be at least 2 characters long.'],
      maxlength: [50, 'Name cannot exceed 50 characters.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => isEmail(value),
        message: 'Invalid email address',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters long.'],
      select: false,
    },
    bio: {
      type: String,
      maxlength: [250, 'Bio cannot exceed 250 characters.'],
    },
    avatar: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    following: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    posts: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
      default: [],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = model<UserType>('User', userSchema);
export default User;
