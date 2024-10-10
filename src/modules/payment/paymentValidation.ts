import { z } from 'zod';
import { ObjectIdSchema } from '../../validation';

export const PaymentSchema = z.object({
  user: ObjectIdSchema,
  amount: z
    .number()
    .positive('Amount must be a positive number.')
    .nonnegative('Amount cannot be negative.'),
  description: z.string().optional(),
  transactionID: z.string().min(1, 'Transaction ID is required.'),
  paymentProvider: z.string().optional(),
});

export type PaymentType = z.infer<typeof PaymentSchema>;
