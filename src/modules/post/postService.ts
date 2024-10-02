import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { Pagination, QueryString } from '../../@types';
import ApiFeatures from '../../builder/APIFeature';
import AppError from '../../errors/app-error';
import { isUserVerified } from '../user/userService';
import Vote from '../vote/voteModel';
import Post from './postModel';
import { PostType, PostUpdateSchemaType } from './postValidation';

export const createPostService = async (data: PostType) => {
  const newPost = new Post(data);

  await newPost.save();

  return newPost;
};

export const updatePostService = async (
  id: string,
  data: PostUpdateSchemaType
) => {
  const post = await Post.findById(id);

  if (!post) throw new AppError('No post found.', httpStatus.NOT_FOUND);

  const updatedPost = await Post.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return updatedPost;
};

export const getAPostService = async (userId: Types.ObjectId, id: string) => {
  const post = await Post.findById(id);

  if (!post) throw new AppError('No post found.', httpStatus.NOT_FOUND);

  if (post.premium) {
    if (!(await isUserVerified(userId))) {
      throw new AppError(
        'You do not have access to this post.',
        httpStatus.NOT_ACCEPTABLE
      );
    }
  }

  return post;
};

export const getAllPostService = async (query: QueryString) => {
  const features = new ApiFeatures<PostType>(Post.find(), query).apply([
    'title ',
  ]);

  const count = new ApiFeatures<PostType>(Post.find(), query)
    .search(['title'])
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
  const posts = await features;

  return {
    posts,
    pagination,
  };
};

export const FeedService = async (
  userId: Types.ObjectId,
  query: QueryString
) => {
  const isVerified = await isUserVerified(userId);
  const postsQuery = isVerified
    ? Post.find()
    : Post.find({ premium: { $ne: true } });

  const features = new ApiFeatures<PostType & { _id: Types.ObjectId }>(
    postsQuery,
    query
  ).apply(['title ']);

  const count = new ApiFeatures<PostType>(Post.find(), query)
    .search(['title'])
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
  const posts = await features;

  const postIds = posts.map((post) => post._id);
  const userVotes = await Vote.find({ post: { $in: postIds }, user: userId });

  const voteMap = userVotes.reduce(
    (acc, vote) => {
      acc[vote.post.toString()] = vote.voteType;
      return acc;
    },
    {} as Record<string, 'upvote' | 'downvote'>
  );

  const postsWithVoteStatus = posts.map((post) => ({
    ...post,
    voteStatus: voteMap[post._id.toString()] || null,
  }));

  return {
    posts: postsWithVoteStatus,
    pagination,
  };
};
export const getPostByUserService = async (
  currentUserId: Types.ObjectId,
  userId: Types.ObjectId,
  query: QueryString
) => {
  let postsQuery;

  const isVerified = await isUserVerified(userId);
  if (userId.equals(currentUserId)) {
    postsQuery = Post.find({ user: currentUserId });
  } else {
    postsQuery = isVerified
      ? Post.find({ user: userId })
      : Post.find({ user: userId, premium: { $ne: true } });
  }

  const features = new ApiFeatures<PostType & { _id: Types.ObjectId }>(
    postsQuery,
    query
  ).apply(['title ']);

  const count = new ApiFeatures<PostType>(Post.find(), query)
    .search(['title'])
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
  const posts = await features;

  const postIds = posts.map((post) => post._id);
  const userVotes = await Vote.find({
    post: { $in: postIds },
    user: currentUserId,
  });

  const voteMap = userVotes.reduce(
    (acc, vote) => {
      acc[vote.post.toString()] = vote.voteType;
      return acc;
    },
    {} as Record<string, 'upvote' | 'downvote'>
  );

  const postsWithVoteStatus = posts.map((post) => ({
    ...post,
    voteStatus: voteMap[post._id.toString()] || null,
  }));

  return {
    posts: postsWithVoteStatus,
    pagination,
  };
};

export const deleteAPostService = async (id: string) => {
  const post = await Post.findById(id);

  if (!post) throw new AppError('No Post found', httpStatus.NOT_FOUND);

  const deletedPost = await Post.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return deletedPost;
};
