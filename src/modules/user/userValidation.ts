import { z } from 'zod';
const userRoleEnum = z.enum(['user', 'admin']).default('user');

export const userValidationSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(2, { message: 'Name must be at least 2 characters long' }),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({ message: 'Invalid email address' }),
  password: z
    .string({
      required_error: 'password is required',
    })
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(50, {
      message: "Password can't be more then 50 characters long",
    }),
  phone: z
    .string({
      required_error: 'Phone is required',
    })
    .regex(/^\+?[0-9][0-9- ]{6,14}[0-9]$/, {
      message: 'Invalid phone number',
    }),

  role: userRoleEnum,
});
