import { z } from 'zod';

export const CategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name cannot be empty.' })
    .max(100, { message: 'Name must be no more than 100 characters.' }),

  description: z
    .string()
    .max(500, { message: 'Description must be no more than 500 characters.' })
    .optional(),
});

export type CategoryType = z.infer<typeof CategorySchema>;
