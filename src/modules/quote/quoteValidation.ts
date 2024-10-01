import { z } from 'zod';

export const QuoteSchema = z.object({
  text: z
    .string()
    .min(1, 'Text is required.')
    .max(500, 'Quote text must not exceed 500 characters.'),
  author: z.string().min(1, 'Author is required'),
  isDeleted: z.boolean().default(false),
});
export const QuoteUpdateSchema = z.object({
  text: z
    .string()
    .min(1, 'Text is required.')
    .max(500, 'Quote text must not exceed 500 characters.'),
  author: z.string().min(1, 'Author is required'),
  isDeleted: z.boolean().default(false),
});

export type QuoteType = z.infer<typeof QuoteSchema>;
export type QuoteUpdateSchemaType = z.infer<typeof QuoteUpdateSchema>;
