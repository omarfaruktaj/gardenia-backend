import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIResponse from '../../utils/APIResponse';
import {
  createPostService,
  deleteAPostService,
  FeedService,
  getAllPostAdminService,
  getAPostAdminService,
  getAPostService,
  getMonthlyPostsService,
  getPostByUserService,
  updatePostService,
} from './postService';

export const createPostController = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const data = req.body;
  // const data = JSON.parse(req.body.data);

  // const images = req.files as Express.Multer.File[];
  // if (images && images.length > 0) {
  //   data.images = images.map((file) => file.path);
  // }
  // data.author = String(userId);

  // const result = await PostSchema.safeParseAsync(data);

  // if (!result.success) {
  //   return next(result.error);
  // }

  const post = await createPostService({ ...data, author: userId });

  res
    .status(httpStatus.CREATED)
    .json(new APIResponse(httpStatus.CREATED, 'Post added successfully', post));
};

export const updatePostController = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const data = req.body;

  // const data = JSON.parse(req.body.data);

  // const images = req.files as Express.Multer.File[];
  // if (images && images.length > 0) {
  //   const newImages = images.map((file) => file.path);

  //   data.images = [...data.images, ...newImages];
  // }
  // const result = await PostUpdateSchema.safeParseAsync(data);

  // if (!result.success) return next(result.error);

  const post = await updatePostService(postId, data);

  res
    .status(httpStatus.CREATED)
    .json(new APIResponse(httpStatus.OK, 'Post updated successfully', post));
};

export const getAllPostAdminController = async (
  req: Request,
  res: Response
) => {
  const { posts, pagination } = await getAllPostAdminService(req.query);

  res.json(
    new APIResponse(
      httpStatus.OK,
      'Posts retrieved successfully',
      posts,
      pagination
    )
  );
};

export const getPostsByUserController = async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.params.id);
  const currentUser = req.user?._id;
  const query = req.query;

  const { posts, pagination } = await getPostByUserService(
    currentUser!,
    userId,
    query
  );

  res.json(
    new APIResponse(
      httpStatus.OK,
      'Posts retrieved successfully',
      posts,
      pagination
    )
  );
};

export const feedController = async (req: Request, res: Response) => {
  const currentUser = req.user?._id;
  const query = req.query;

  const { posts, pagination } = await FeedService(query, currentUser);

  res.json(
    new APIResponse(
      httpStatus.OK,
      'Feed posts retrieved successfully',
      posts,
      pagination
    )
  );
};

export const getAPostController = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const userId = req.user?._id;

  const post = await getAPostService(userId!, postId);

  res.json(new APIResponse(httpStatus.OK, 'Post retrieved successfully', post));
};

export const getAPostAdminController = async (req: Request, res: Response) => {
  const postId = req.params.id;

  const post = await getAPostAdminService(postId);

  res.json(new APIResponse(httpStatus.OK, 'Post retrieved successfully', post));
};

export const deletePostController = async (req: Request, res: Response) => {
  const postId = req.params.id;

  const post = await deleteAPostService(postId);

  res
    .status(httpStatus.OK)
    .json(new APIResponse(httpStatus.OK, 'Post deleted successfully', post));
};

export const getMonthlyPostsController: RequestHandler = async (_req, res) => {
  const posts = await getMonthlyPostsService();

  res.json(
    new APIResponse(httpStatus.OK, 'posts retrieved successfully', posts)
  );
};
