import { z } from 'zod';
import { ObjectIdSchema } from '../../validation';

export const QuoteSchema = z.object({
  text: z
    .string()
    .min(1, 'Text is required.')
    .max(500, 'Quote text must not exceed 500 characters.'),
  author: ObjectIdSchema,
  isDeleted: z.boolean().default(false),
});

export type QuoteType = z.infer<typeof QuoteSchema>;
