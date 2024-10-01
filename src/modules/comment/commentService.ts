import httpStatus from 'http-status';
import { Pagination, QueryString } from '../../@types';
import ApiFeatures from '../../builder/APIFeature';
import AppError from '../../errors/app-error';
import Post from '../post/postModel';
import Comment from './commentModel';
import { CommentType, CommentUpdateSchemaType } from './commentValidation';

export const createCommentService = async (data: CommentType) => {
  const post = await Post.findById(data.post);

  if (!post) throw new AppError('No post found', httpStatus.NOT_FOUND);

  const newComment = new Comment(data);

  await newComment.save();

  return newComment;
};

export const updateCommentService = async (
  id: string,
  data: CommentUpdateSchemaType
) => {
  const comment = await Comment.findById(id);

  if (!comment) throw new AppError('No comment found.', httpStatus.NOT_FOUND);

  const updatedComment = await Comment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return updatedComment;
};

export const getACommentService = async (id: string) => {
  const comment = await Comment.findById(id);

  if (!comment) throw new AppError('No comment found.', httpStatus.NOT_FOUND);

  return comment;
};

export const getCommentByPostService = async (
  postId: string,
  query: QueryString
) => {
  const features = new ApiFeatures<CommentType>(
    Comment.find({ post: postId }),
    query
  )
    .sort()
    .limitFields()
    .paginate();

  const count = new ApiFeatures<CommentType>(
    Comment.find({ post: postId }),
    query
  );

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
  console.log(postId, query);
  const comments = await features.query;

  return {
    comments,
    pagination,
  };
};

export const deleteACommentService = async (id: string) => {
  const comment = await Comment.findById(id);

  if (!comment) throw new AppError('No Comment found', httpStatus.NOT_FOUND);

  const deletedComment = await Comment.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return deletedComment;
};
