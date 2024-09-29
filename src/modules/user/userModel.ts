import bcrypt from 'bcrypt';
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
    username: {
      type: String,
      required: [true, 'Username is required.'],
      minlength: [1, 'Username must be at least 1 character long.'],
      maxlength: [30, 'Username cannot exceed 30 characters.'],
      unique: true,
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
        message: 'Invalid email address.',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters long.'],
      select: false,
    },
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters.'],
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
    passwordChangedAt: { type: Date },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date();
  next();
});

const User = model<UserType>('User', userSchema);
export default User;
