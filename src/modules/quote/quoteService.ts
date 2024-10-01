import httpStatus from 'http-status';
import { Pagination, QueryString } from '../../@types';
import ApiFeatures from '../../builder/APIFeature';
import AppError from '../../errors/app-error';
import Quote from './quoteModel';
import { QuoteType, QuoteUpdateSchemaType } from './quoteValidation';

export const getAllQuotesService = async (query: QueryString) => {
  const features = new ApiFeatures<QuoteType>(Quote.find(), query)
    .sort()
    .limitFields()
    .paginate();

  const total = await features.query.countDocuments();
  const totalPage = Math.ceil(total / (Number(query.limit) || 10));

  const pagination: Pagination = {
    totalPage,
    total,
    limit: Number(query.limit) || 10,
    page: Number(query.page) || 1,
    next:
      (Number(query.page) || 1) < totalPage
        ? (Number(query.page) || 1) + 1
        : undefined,
    prev: (Number(query.page) || 1) > 1 ? Number(query.page) - 1 : undefined,
  };

  const quotes = await features.query;

  return {
    quotes,
    pagination,
  };
};

export const getAQuoteService = async (id: string) => {
  const quote = await Quote.findById(id);
  if (!quote) throw new AppError('No quote found.', httpStatus.NOT_FOUND);
  return quote;
};

export const createQuoteService = async (data: QuoteType) => {
  const newQuote = new Quote(data);
  await newQuote.save();
  return newQuote;
};

export const updateQuoteService = async (
  id: string,
  data: QuoteUpdateSchemaType
) => {
  const quote = await Quote.findById(id);
  if (!quote) throw new AppError('No quote found.', httpStatus.NOT_FOUND);
  const updatedQuote = await Quote.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return updatedQuote;
};

export const deleteAQuoteService = async (id: string) => {
  const quote = await Quote.findById(id);
  if (!quote) throw new AppError('No quote found', httpStatus.NOT_FOUND);
  const deletedQuote = await Quote.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return deletedQuote;
};

export const getRandomQuoteService = async () => {
  const count = await Quote.countDocuments();
  const random = Math.floor(Math.random() * count);
  const randomQuote = await Quote.findOne().skip(random);
  return randomQuote;
};
