import { Types } from 'mongoose';
import { z } from 'zod';

export const ObjectIdSchema = z
  .string()
  .refine((id) => Types.ObjectId.isValid(id), {
    message: 'Invalid ObjectId format.',
  })
  .transform((id) => new Types.ObjectId(id));
