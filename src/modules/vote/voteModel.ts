import mongoose, { model, Schema } from 'mongoose';
import { VoteSchemaType, VoteType } from './voteValidation';

const voteSchema = new Schema<VoteSchemaType>(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide the post ID.'],
      ref: 'Post',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide the user ID.'],
      ref: 'User',
    },
    voteType: {
      type: String,
      required: [true, 'Please specify if it is an upvote or downvote.'],
      enum: {
        values: Object.values(VoteType),
        message: 'Vote type must be either "upvote" or "downvote".',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Vote = model<VoteSchemaType>('Vote', voteSchema);

export default Vote;
