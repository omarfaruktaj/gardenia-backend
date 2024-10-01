import { model, Schema } from 'mongoose';
import { QuoteType } from './quoteValidation';

const QuoteSchema: Schema = new Schema<QuoteType>(
  {
    text: {
      type: String,
      required: [true, 'Quote text is required.'],
      minlength: [1, 'Quote text must be at least 1 character long.'],
      maxlength: [500, 'Quote text must not exceed 500 characters.'],
    },
    author: {
      type: String,
      required: [true, 'Please provide the Author.'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Quote = model<QuoteType>('Quote', QuoteSchema);

export default Quote;
