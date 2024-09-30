import httpStatus from 'http-status';
import { Pagination, QueryString } from '../../@types';
import ApiFeatures from '../../builder/APIFeature';
import AppError from '../../errors/app-error';
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

export const getAPostService = async (id: string) => {
  const post = await Post.findById(id);

  if (!post) throw new AppError('No post found.', httpStatus.NOT_FOUND);

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
