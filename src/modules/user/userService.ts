import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import { Pagination } from '../../@types';
import ApiFeatures, { QueryString } from '../../builder/APIFeature';
import AppError from '../../errors/app-error';
import Payment from '../payment/paymentModel';
import Post from '../post/postModel';
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
  const existedUsername = await User.findOne({ username: data.username });

  if (existedUsername)
    throw new AppError('Username already exist.', httpStatus.CONFLICT);

  const isUserExist = await User.findById(userId);

  if (!isUserExist) throw new AppError('No User found', httpStatus.NOT_FOUND);

  const user = await User.findByIdAndUpdate(userId, data);

  return user;
};

export const getAllUserService = async (query: QueryString) => {
  const features = new ApiFeatures<UserType>(User.find(), query).apply([
    'name',
  ]);

  const count = new ApiFeatures<UserType>(User.find(), query)
    .search(['name'])
    .filter();

  const total = await count.query.countDocuments();

  const totalPage = Math.ceil(total / (Number(query.limit) || 10));
  const pagination: Pagination = {
    totalPage,
    total,
    limit: Number(query.limit) || 10,

    page: Number(query.page) || 1,
  };
  if ((Number(query.page) || 1) < totalPage) {
    pagination.next = (Number(query.page) || 1) + 1;
  }

  if ((Number(query.page) || 1) > 1) {
    pagination.prev = Number(query.page) - 1;
  }
  const users = await features;

  return {
    users,
    pagination,
  };
};

export const deleteUserService = async (id: string) => {
  const user = await User.findById(id);

  if (!user) throw new AppError('No user found', httpStatus.NOT_FOUND);

  const deletedUser = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return deletedUser;
};

export const followUserService = async (
  currentUserId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) => {
  const userToFollow = await User.findById(userId);

  if (!userToFollow) throw new AppError('No user found', httpStatus.NOT_FOUND);

  userToFollow.followers?.push(currentUserId);
  await userToFollow.save();

  const currentUser = await User.findById(currentUserId);

  currentUser?.following?.push(userId);
  await currentUser?.save();

  return userToFollow.username;
};
export const unfollowUserService = async (
  currentUserId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) => {
  const userToUnfollow = await User.findById(userId);

  if (!userToUnfollow)
    throw new AppError('No user found', httpStatus.NOT_FOUND);

  userToUnfollow.followers = userToUnfollow?.followers?.filter(
    (followerId) => !followerId.equals(currentUserId)
  );
  await userToUnfollow.save();

  const currentUser = await User.findById(currentUserId);

  if (!currentUser) throw new AppError('No user found', httpStatus.NOT_FOUND);

  currentUser.following = currentUser?.following?.filter(
    (followingId) => !followingId.equals(userId)
  );
  await currentUser?.save();

  return userToUnfollow.username;
};

export const getFollowersService = async (userId: mongoose.Types.ObjectId) => {
  const user = await User.findById(userId).populate('followers', 'username');
  if (!user) throw new Error('User not found');

  return user.followers;
};

export const getFollowingService = async (userId: mongoose.Types.ObjectId) => {
  const user = await User.findById(userId).populate('following', 'username');
  if (!user) throw new Error('User not found');

  return user.followers;
};

export const getVerificationStatusService = async (
  userId: mongoose.Types.ObjectId
) => {
  const user = await User.findById(userId);

  if (!user) throw new AppError('No user found', httpStatus.NOT_FOUND);

  const posts = await Post.find({ author: userId });
  const votes = posts.reduce((total, post) => total + post.votes, 0);
  const eligible = votes >= 1;

  return {
    eligible,
    votes,
  };
};

export const userVerifyService = async (userId: mongoose.Types.ObjectId) => {
  const user = await User.findById(userId);

  if (!user) throw new AppError('No user found', httpStatus.NOT_FOUND);

  const posts = await Post.find({ author: userId });
  const votes = posts.reduce((total, post) => total + post.votes, 0);
  const eligible = votes >= 1;

  if (!eligible)
    throw new AppError(
      'You are not eligible for varification',
      httpStatus.BAD_REQUEST
    );

  const payment = await Payment.findOne({ userId });

  if (!payment)
    throw new AppError(
      'Please payment to veryfy your account.',
      httpStatus.BAD_REQUEST
    );

  user.isVerified = true;
  await user.save();

  return user;
};

export const isUserVerified = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);
  return user && user.isVerified;
};
