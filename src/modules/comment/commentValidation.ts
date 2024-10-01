import { isValidObjectId, Types } from 'mongoose';
import { z } from 'zod';
import { ObjectIdSchema } from '../../validation';

export const CommentSchema = z.object({
  post: z
    .string()
    .refine(isValidObjectId, { message: 'Invalid post ID.' })
    .transform((id) => new Types.ObjectId(id)),
  user: ObjectIdSchema,
  content: z
    .string()
    .min(1, { message: 'Content cannot be empty.' })
    .max(500, { message: 'Content must be no more than 500 characters.' }),

  replyTo: z.array(ObjectIdSchema).optional(),

  replies: z.array(ObjectIdSchema).optional(),
  isDeleted: z.boolean().default(false),
});
export const CommentUpdateSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Content cannot be empty.' })
    .max(500, { message: 'Content must be no more than 500 characters.' }),
});

export type CommentType = z.infer<typeof CommentSchema>;
export type CommentUpdateSchemaType = z.infer<typeof CommentUpdateSchema>;
