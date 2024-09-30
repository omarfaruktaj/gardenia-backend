import { z } from 'zod';
import { ObjectIdSchema } from '../../validation';

export const PostSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required.' })
    .max(100, { message: 'Title must be less than 100 characters.' }),

  content: z
    .string()
    .min(1, { message: 'Content is required.' })
    .max(5000, { message: 'Content must be less than 5000 characters.' }),

  category: ObjectIdSchema.optional(),
  images: z
    .array(z.string().url({ message: 'Each image must be a valid URL.' }))
    .optional()
    .default([]),

  author: ObjectIdSchema,

  votes: z.number().default(0).optional(),

  premium: z.boolean().default(false).optional(),
  isDeleted: z.boolean().default(false),
});

export const PostUpdateSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required.' })
    .max(100, { message: 'Title must be less than 100 characters.' })
    .optional(),

  content: z
    .string()
    .min(1, { message: 'Content is required.' })
    .max(5000, { message: 'Content must be less than 5000 characters.' })
    .optional(),

  category: ObjectIdSchema.optional(),
  images: z
    .array(z.string().url({ message: 'Each image must be a valid URL.' }))
    .optional()
    .default([]),

  author: ObjectIdSchema.optional(),

  votes: z.number().default(0).optional(),

  premium: z.boolean().default(false).optional(),
  isDeleted: z.boolean().default(false),
});

export type PostType = z.infer<typeof PostSchema>;
export type PostUpdateSchemaType = z.infer<typeof PostUpdateSchema>;
