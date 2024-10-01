import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/app-error';
import APIResponse from '../../utils/APIResponse';
import {
  createCommentService,
  deleteACommentService,
  getACommentService,
  getCommentByPostService,
  updateCommentService,
} from './commentService';

import { CommentSchema, CommentUpdateSchema } from './commentValidation';

export const createCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?._id;
  const postId = req.params.id;

  if (!userId || !postId)
    return next(new AppError('Invalid Request', httpStatus.BAD_REQUEST));

  const data = req.body;
  data.user = String(userId);
  data.post = String(postId);

  const result = await CommentSchema.safeParseAsync(data);

  if (!result.success) {
    return next(result.error);
  }

  const comment = await createCommentService(result.data);

  res
    .status(httpStatus.CREATED)
    .json(
      new APIResponse(httpStatus.CREATED, 'Comment added successfully', comment)
    );
};

export const updateCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.id;

  const data = req.body;

  const result = await CommentUpdateSchema.safeParseAsync(data);

  if (!result.success) return next(result.error);

  const comment = await updateCommentService(commentId, result.data);

  res
    .status(httpStatus.CREATED)
    .json(
      new APIResponse(httpStatus.OK, 'Comment updated successfully', comment)
    );
};

export const getCommentByPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.id;

  if (!postId)
    return next(new AppError('Invalid Request', httpStatus.BAD_REQUEST));

  const { comments, pagination } = await getCommentByPostService(
    postId,
    req.query
  );

  res.json(
    new APIResponse(
      httpStatus.OK,
      'Comments retrieved successfully',
      comments,
      pagination
    )
  );
};

export const getACommentController: RequestHandler = async (req, res) => {
  const commentId = req.params.id;
  const comment = await getACommentService(commentId);

  res.json(
    new APIResponse(httpStatus.OK, 'Comment retrieved successfully', comment)
  );
};

export const deleteCommentController: RequestHandler = async (req, res) => {
  const commentId = req.params.id;

  const comment = await deleteACommentService(commentId);

  res
    .status(httpStatus.OK)
    .json(
      new APIResponse(httpStatus.OK, 'Comment deleted successfully', comment)
    );
};
