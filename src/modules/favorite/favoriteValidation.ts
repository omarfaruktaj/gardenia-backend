import { z } from 'zod';
import { ObjectIdSchema } from '../../validation';

export const FavoriteSchema = z.object({
  user: ObjectIdSchema,
  post: ObjectIdSchema,
});

export type FavoriteType = z.infer<typeof FavoriteSchema>;
