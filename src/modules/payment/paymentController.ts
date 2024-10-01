import { Request, Response } from 'express';
import httpStatus from 'http-status';
import APIResponse from '../../utils/APIResponse';
import { initiatePaymentService } from './paymentService';

export const initiatePaymentController = async (
  _req: Request,
  res: Response
) => {
  const session = await initiatePaymentService();
  res
    .status(httpStatus.CREATED)
    .json(
      new APIResponse(
        httpStatus.CREATED,
        'session generate successfully ',
        session
      )
    );
};
