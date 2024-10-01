import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import APIResponse from '../../utils/APIResponse';
import {
  createQuoteService,
  deleteAQuoteService,
  getAQuoteService,
  getAllQuotesService,
  getRandomQuoteService,
  updateQuoteService,
} from './quoteService';
import { QuoteSchema, QuoteUpdateSchema } from './quoteValidation';

export const getAllQuotesController = async (req: Request, res: Response) => {
  const { quotes, pagination } = await getAllQuotesService(req.query);
  res.json(
    new APIResponse(
      httpStatus.OK,
      'Quotes retrieved successfully',
      quotes,
      pagination
    )
  );
};

export const getRandomQuoteController = async (
  _req: Request,
  res: Response
) => {
  const quote = await getRandomQuoteService();
  res.json(
    new APIResponse(httpStatus.OK, 'Random quote retrieved successfully', quote)
  );
};

export const getAQuoteController = async (req: Request, res: Response) => {
  const quoteId = req.params.id;
  const quote = await getAQuoteService(quoteId);
  res.json(
    new APIResponse(httpStatus.OK, 'Quote retrieved successfully', quote)
  );
};

export const createQuoteController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const result = await QuoteSchema.safeParseAsync(data);
  if (!result.success) return next(result.error);
  const quote = await createQuoteService(result.data);
  res
    .status(httpStatus.CREATED)
    .json(
      new APIResponse(httpStatus.CREATED, 'Quote added successfully', quote)
    );
};

export const updateQuoteController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const quoteId = req.params.id;
  const data = req.body;
  const result = await QuoteUpdateSchema.safeParseAsync(data);

  if (!result.success) return next(result.error);

  const quote = await updateQuoteService(quoteId, result.data);

  res
    .status(httpStatus.OK)
    .json(new APIResponse(httpStatus.OK, 'Quote updated successfully', quote));
};

export const deleteQuoteController = async (req: Request, res: Response) => {
  const quoteId = req.params.id;
  const quote = await deleteAQuoteService(quoteId);
  res
    .status(httpStatus.OK)
    .json(new APIResponse(httpStatus.OK, 'Quote deleted successfully', quote));
};
