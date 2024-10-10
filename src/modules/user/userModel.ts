import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mongoose, { model, Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import makeFieldsPrivatePlugin from '../../lib/privateField';
import { IUserMethods, UserModel } from './userInterface';
import { UserType } from './userValidation';

const userSchema = new Schema<UserType, UserModel, IUserMethods>(
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
      minlength: [6, 'Password must be at least 6 characters long.'],
      select: false,
    },
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters.'],
    },
    avatar: {
      type: String,
    },
    cover: {
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
userSchema.virtual('favorites', {
  ref: 'Favorite',
  foreignField: 'user',
  localField: '_id',
});

userSchema.plugin(makeFieldsPrivatePlugin, ['password']);

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

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.statics.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedTimeStamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};
const filterDeleted = function (
  this: mongoose.Query<UserType[], UserType>,
  next: () => void
) {
  this.where({ isDeleted: false });
  next();
};

userSchema.pre('find', filterDeleted);
userSchema.pre('findOne', filterDeleted);

const User = model<UserType, UserModel>('User', userSchema);
export default User;
