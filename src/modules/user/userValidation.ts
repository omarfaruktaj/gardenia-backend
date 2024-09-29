import { z } from 'zod';
import { ObjectIdSchema } from '../../validation';

export const UserSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required.' })
    .max(50, { message: 'Name must be less than 50 characters.' }),

  username: z
    .string()
    .min(1, { message: 'Username is required.' })
    .max(30, { message: 'Username must be less than 30 characters.' })
    .optional(),

  email: z
    .string()
    .email({ message: 'Invalid email address.' })
    .max(100, { message: 'Email must be less than 100 characters.' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .max(100, { message: 'Password must be less than 100 characters.' }),

  bio: z
    .string()
    .max(300, { message: 'Bio must be less than 300 characters.' })
    .optional(),

  avatar: z.string().url({ message: 'Avatar must be a valid URL.' }).optional(),

  isVerified: z.boolean().optional().default(false).optional(),

  followers: z.array(ObjectIdSchema).optional(),

  following: z.array(ObjectIdSchema).optional(),

  role: z
    .enum(['user', 'admin'], {
      message: "Role must be either 'user' or 'admin'.",
    })
    .default('user')
    .optional(),

  passwordResetToken: z.string().optional(),
  passwordChangedAt: z.date().optional(),
  passwordResetTokenExpire: z.date().optional(),
  isDeleted: z.boolean().default(false).optional(),
});

export type UserType = z.infer<typeof UserSchema>;
