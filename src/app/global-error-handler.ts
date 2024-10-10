import { ErrorRequestHandler, Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ZodError, ZodIssue } from 'zod';
import env from '../config/env';
import AppError from '../errors/app-error';

//* handle zod error
const handleZodError = (err: ZodError) => {
  const errorMessages = err.issues.map((issue: ZodIssue) => {
    return {
      path: String(issue?.path[issue.path.length - 1]),
      message: issue.message,
    };
  });

  return new AppError(
    'Validation Error',
    httpStatus.BAD_REQUEST,
    errorMessages
  );
};

//* Handle validation error
const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorMessages = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    }
  );

  return new AppError(
    'Validation Error',
    httpStatus.BAD_REQUEST,
    errorMessages
  );
};

//* handle cast error
const handleCastErrorError = (err: mongoose.Error.CastError) => {
  const errorMessages = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  return new AppError(
    'Validation Error',
    httpStatus.BAD_REQUEST,
    errorMessages
  );
};

//* handle duplicate error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any) => {
  const keyValue = err.keyValue;
  const keyPath = Object.keys(keyValue)[0];

  const value = keyValue[keyPath];
  const errorMessages = [
    {
      path: keyPath,
      message: `${value} is already exists`,
    },
  ];

  return new AppError(
    'Validation Error',
    httpStatus.BAD_REQUEST,
    errorMessages
  );
};

const handleJWTError = () => {
  return new AppError(
    'Invalid token. Please log in again!',
    httpStatus.UNAUTHORIZED
  );
};

const handleJWTExpiredError = () => {
  return new AppError(
    'Your token has expired! Please log in again.',
    httpStatus.UNAUTHORIZED
  );
};

//* handle development error
const handleDevelopmentError = (
  err: AppError,
  _req: Request,
  res: Response
) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const handleProductionError = (err: AppError, _req: Request, res: Response) => {
  //* Trusted Error send message
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).json({
      status: err.status,
      errors: err.errors,
      message: err.message,
    });
  }
  console.log(err);
  //! Untrusted error! Don't leap information
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (env.NODE_ENV === 'development') {
    handleDevelopmentError(error, req, res);
  } else if (env.NODE_ENV === 'production') {
    let err = { ...error };

    err.message = error.message;
    err.status = error.status || 'error';
    err.statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

    if (error instanceof ZodError) err = handleZodError(error);
    if (error?.name === 'ValidationError') err = handleValidationError(error);
    if (error?.name === 'CastError') err = handleCastErrorError(error);
    if (error?.code === 11000) err = handleDuplicateError(error);
    if (error?.name === 'JsonWebTokenError') err = handleJWTError();
    if (error?.name === 'TokenExpiredError') err = handleJWTExpiredError();

    handleProductionError(err, req, res);
  }
};

export default globalErrorHandler;
