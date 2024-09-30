import { Request, Response } from 'express';
import httpStatus from 'http-status';
import APIResponse from '../../utils/APIResponse';

export const getMeController = async (req: Request, res: Response) => {
  res.json(new APIResponse(httpStatus.OK, 'get me successfully', req.user));
};
