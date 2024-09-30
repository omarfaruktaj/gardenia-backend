import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import APIResponse from '../../utils/APIResponse';
import {
  createPostService,
  deleteAPostService,
  getAllPostService,
  getAPostService,
  updatePostService,
} from './postService';
import { PostSchema, PostUpdateSchema } from './postValidation';

export const createPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?._id;
  const data = JSON.parse(req.body.data);

  const images = req.files as Express.Multer.File[];
  if (images && images.length > 0) {
    data.images = images.map((file) => file.path);
  }
  data.author = String(userId);

  const result = await PostSchema.safeParseAsync(data);

  if (!result.success) {
    return next(result.error);
  }

  const post = await createPostService(result.data);

  res
    .status(httpStatus.CREATED)
    .json(new APIResponse(httpStatus.CREATED, 'Post added successfully', post));
};

export const updatePostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.id;

  const data = JSON.parse(req.body.data);

  const images = req.files as Express.Multer.File[];
  if (images && images.length > 0) {
    const newImages = images.map((file) => file.path);

    data.images = [...data.images, ...newImages];
  }
  const result = await PostUpdateSchema.safeParseAsync(data);

  if (!result.success) return next(result.error);

  const post = await updatePostService(postId, result.data);

  res
    .status(httpStatus.CREATED)
    .json(new APIResponse(httpStatus.OK, 'Post updated successfully', post));
};

export const getAllPostController = async (req: Request, res: Response) => {
  const { posts, pagination } = await getAllPostService(req.query);

  res.json(
    new APIResponse(
      httpStatus.OK,
      'Posts retrieved successfully',
      posts,
      pagination
    )
  );
};

export const getAPostController: RequestHandler = async (req, res) => {
  const postId = req.params.id;
  const post = await getAPostService(postId);

  res.json(new APIResponse(httpStatus.OK, 'Post retrieved successfully', post));
};

export const deletePostController: RequestHandler = async (req, res) => {
  const postId = req.params.id;

  const post = await deleteAPostService(postId);

  res
    .status(httpStatus.OK)
    .json(new APIResponse(httpStatus.OK, 'Post deleted successfully', post));
};
