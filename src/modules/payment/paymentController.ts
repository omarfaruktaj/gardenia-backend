import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/app-error';
import APIResponse from '../../utils/APIResponse';
import {
  confirmPaymentService,
  initiatePaymentService,
} from './paymentService';
import { PaymentSchema } from './paymentValidation';

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

export const confirmPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user?._id;

  const data = req.body;

  data.user = user;
  data.paymentProvider = 'stripe';

  const result = await PaymentSchema.safeParseAsync(data);

  if (!result.success) {
    return next(new AppError(result.error.message, httpStatus.BAD_REQUEST));
  }
  const payment = await confirmPaymentService(req.body);

  res
    .status(httpStatus.CREATED)
    .json(
      new APIResponse(
        httpStatus.CREATED,
        'Payment confirmed successfully',
        payment
      )
    );
};
