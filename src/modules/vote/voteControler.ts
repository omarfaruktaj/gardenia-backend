import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import APIResponse from '../../utils/APIResponse';
import { getMonthlyVotesService, voteOnPostService } from './voteService';
import { voteSchema } from './voteValidation';

export const voteOnPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const userId = String(req.user?._id);
  const postId = req.params.id;

  data.user = userId;
  data.post = postId;

  const result = await voteSchema.safeParseAsync(data);

  if (!result.success) {
    return next(result.error);
  }

  const { user, post, voteType } = result.data;

  const votedPost = await voteOnPostService(post, user, voteType);

  res
    .status(httpStatus.CREATED)
    .json(new APIResponse(httpStatus.CREATED, 'voted successfully', votedPost));
};

export const getMonthlyVotesController: RequestHandler = async (_req, res) => {
  const votes = await getMonthlyVotesService();

  res.json(
    new APIResponse(httpStatus.OK, 'votes retrieved successfully', votes)
  );
};
