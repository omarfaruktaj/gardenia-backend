import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { Pagination, QueryString } from '../../@types';
import ApiFeatures from '../../builder/APIFeature';
import { monthNames } from '../../constant';
import AppError from '../../errors/app-error';
import User from '../user/userModel';
import { isUserVerified } from '../user/userService';
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
  const post = await Post.findById(id)
    .populate(['author', 'allVotes', 'category'])
    .populate({
      path: 'comments',
      select: '_id',
    });

  if (!post) throw new AppError('No post found.', httpStatus.NOT_FOUND);

  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found.', httpStatus.NOT_FOUND);

  if (post.premium && user.role !== 'admin' && !user.isVerified) {
    if (!(await isUserVerified(userId))) {
      throw new AppError(
        'You do not have access to this post.',
        httpStatus.NOT_ACCEPTABLE
      );
    }
  }

  return post;
};

export const getAPostAdminService = async (id: string) => {
  const post = await Post.findById(id);

  if (!post) throw new AppError('No post found.', httpStatus.NOT_FOUND);

  return post;
};

export const getAllPostAdminService = async (query: QueryString) => {
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
  const posts = await features.populate(['author', 'category']).populate({
    path: 'comments',
    select: '_id',
  });

  return {
    posts,
    pagination,
  };
};

export const FeedService = async (
  query: QueryString,
  userId?: Types.ObjectId
) => {
  const isVerified = userId ? await isUserVerified(userId) : false;

  const postsQuery = isVerified
    ? Post.find()
    : Post.find({ premium: { $ne: true } });

  const features = new ApiFeatures<PostType & { _id: Types.ObjectId }>(
    postsQuery,
    query
  ).apply(['title']);
  const postsQueryForCount = isVerified
    ? Post.find()
    : Post.find({ premium: { $ne: true } });

  const count = new ApiFeatures<PostType>(postsQueryForCount, query)
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
  const posts = await features.populate(['author', 'category']).populate({
    path: 'comments',
    select: '_id',
  });

  // const postIds = posts.map((post) => post._id);

  // const userVotes = await Vote.find({ post: { $in: postIds }, user: userId });
  // const voteMap = userVotes.reduce(
  //   (acc, vote) => {
  //     console.log(vote.voteType);
  //     acc[vote.post.toString()] = vote.voteType;
  //     return acc;
  //   },
  //   {} as Record<string, 'upvote' | 'downvote'>
  // );

  // const postsWithVoteStatus = posts.map((post) => ({
  //   ...post,
  //   voteStatus: voteMap[post._id.toString()] || null,
  // }));

  // console.log(postsWithVoteStatus);
  // : postsWithVoteStatus,
  return {
    posts,
    pagination,
  };
};

export const getPostByUserService = async (
  currentUserId: Types.ObjectId,
  userId: Types.ObjectId,
  query: QueryString
) => {
  let postsQuery;
  let countPostQuery;

  const isVerified = await isUserVerified(userId);
  if (userId.equals(currentUserId)) {
    postsQuery = Post.find({ author: currentUserId });
  } else {
    postsQuery = isVerified
      ? Post.find({ author: userId })
      : Post.find({ author: userId, premium: { $ne: true } });
  }
  if (userId.equals(currentUserId)) {
    console.log(true);
    countPostQuery = Post.find({ user: currentUserId });
  } else {
    countPostQuery = isVerified
      ? Post.find({ author: userId })
      : Post.find({ author: userId, premium: { $ne: true } });
  }

  const features = new ApiFeatures<PostType & { _id: Types.ObjectId }>(
    postsQuery,
    query
  ).apply(['title ']);

  const count = new ApiFeatures<PostType>(countPostQuery, query)
    .search(['title'])
    .filter();

  const total = await count.query.countDocuments();

  console.log(total);

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
  const posts = await features.populate(['author', 'category']).populate({
    path: 'comments',
    select: '_id',
  });

  console.log(posts);

  // const postIds = posts.map((post) => post._id);
  // const userVotes = await Vote.find({
  //   post: { $in: postIds },
  //   author: currentUserId,
  // });

  // const voteMap = userVotes.reduce(
  //   (acc, vote) => {
  //     acc[vote.post.toString()] = vote.voteType;
  //     return acc;
  //   },
  //   {} as Record<string, 'upvote' | 'downvote'>
  // );

  // const postsWithVoteStatus = posts.map((post) => ({
  //   ...post,
  //   voteStatus: voteMap[post._id.toString()] || null,
  // }));

  return {
    posts,
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

export const getMonthlyPostsService = async () => {
  const posts = await Post.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return posts.map(({ _id, count }) => {
    const [year, month] = _id.split('-');
    return {
      month: monthNames[parseInt(month, 10) - 1],
      year,
      count,
    };
  });
};

// export const getMonthlyPostsService = async () => {
//   console.log('hellow');
//   const posts = await Post.aggregate([
//     {
//       $group: {
//         _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { _id: 1 } },
//   ]);
//   return posts;
// };
