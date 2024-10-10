import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/app-error';
import APIResponse from '../../utils/APIResponse';
import {
  confirmPaymentService,
  getAllPaymentsService,
  getMonthlyPaymentsService,
  initiatePaymentService,
} from './paymentService';
import { PaymentSchema } from './paymentValidation';

export const initiatePaymentController = async (
  req: Request,
  res: Response
) => {
  const userId = req?.user?._id;
  const session = await initiatePaymentService(String(userId));
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

  data.user = String(user);
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

export const getAllPaymentsController = async (req: Request, res: Response) => {
  const { pagination, payments } = await getAllPaymentsService(req.query);

  res.json(
    new APIResponse(httpStatus.OK, 'Payments retrieved successfully', {
      payments,
      pagination,
    })
  );
};

export const getMonthlyPaymentsController: RequestHandler = async (
  _req,
  res
) => {
  const payments = await getMonthlyPaymentsService();

  res.json(
    new APIResponse(httpStatus.OK, 'Payments retrieved successfully', payments)
  );
};
