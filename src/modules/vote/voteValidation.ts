import { z } from 'zod';
import { ObjectIdSchema } from '../../validation';

export enum VoteType {
  Upvote = 'upvote',
  Downvote = 'downvote',
}

export const voteSchema = z.object({
  post: ObjectIdSchema,
  user: ObjectIdSchema,
  voteType: z.nativeEnum(VoteType, {
    errorMap: () => ({
      message: "Vote type must be either 'upvote' or 'downvote'.",
    }),
  }),
});

export type VoteSchemaType = z.infer<typeof voteSchema>;
