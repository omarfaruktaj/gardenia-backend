import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import { Pagination } from '../../@types';
import ApiFeatures, { QueryString } from '../../builder/APIFeature';
import { monthNames } from '../../constant';
import AppError from '../../errors/app-error';
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
  const existedUserWithUsername = await User.findOne({
    username: data.username,
  });

  if (
    existedUserWithUsername &&
    !(userId === String(existedUserWithUsername?._id))
  )
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

export const getFollowersService = async (
  userId: mongoose.Types.ObjectId,
  query: QueryString
) => {
  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const totalFollowers = user.followers?.length || 0;

  const totalPage = Math.ceil(totalFollowers / limit);
  const pagination: Pagination = {
    totalPage,
    total: totalFollowers,
    limit,
    page,
  };

  if (page < totalPage) {
    pagination.next = page + 1;
  }

  if (page > 1) {
    pagination.prev = page - 1;
  }

  const skip = (page - 1) * limit;
  const followers = await User.findById(userId).select('followers').populate({
    path: 'followers',
    options: {
      limit,
      skip,
    },
  });

  return {
    followers: followers?.followers,
    pagination,
  };
};

export const getMeService = async (userId: string) => {
  const user = await User.findById(userId).populate('favorites');
  return user;
};

export const getFollowingService = async (
  userId: mongoose.Types.ObjectId,
  query: QueryString
) => {
  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const totalFollowing = user.following?.length || 0;

  const totalPage = Math.ceil(totalFollowing / limit);
  const pagination: Pagination = {
    totalPage,
    total: totalFollowing,
    limit,
    page,
  };

  if (page < totalPage) {
    pagination.next = page + 1;
  }

  if (page > 1) {
    pagination.prev = page - 1;
  }

  const skip = (page - 1) * limit;
  const following = await User.findById(userId).select('following').populate({
    path: 'following',
    options: {
      limit,
      skip,
    },
  });

  return {
    following: following?.following,
    pagination,
  };
};

export const getAUserWithVerificationEligible = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('No user found', httpStatus.NOT_FOUND);

  let verificationEligible = false;

  const posts = await Post.find({ author: user._id });

  if (!user.isVerified) {
    const votes = posts.reduce((total, post) => total + post.votes, 0);
    verificationEligible = votes >= 1;
  }

  const userData = user.toObject();

  return {
    ...userData,
    posts: posts.length,
    verificationEligible,
  };
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
      'You are not eligible for verification',
      httpStatus.BAD_REQUEST
    );
};

export const changeRoleService = async (
  userId: mongoose.Types.ObjectId,
  data: { role: 'admin' | 'user' }
) => {
  const user = await User.findById(userId);

  if (!user) throw new AppError('No user found', httpStatus.NOT_FOUND);

  user.role = data.role;

  const updatedUser = await user.save();
  return updatedUser;
};

export const isUserVerified = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);
  return user && user.isVerified;
};

export const getUserActivityService = async () => {
  const activities = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return activities.map(({ _id, totalUsers }) => {
    const [year, month] = _id.split('-');
    return {
      month: monthNames[parseInt(month, 10) - 1],
      year,
      totalUsers,
    };
  });
};
