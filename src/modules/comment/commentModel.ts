import mongoose, { model, Schema } from 'mongoose';
import { IComment } from './commentInterface';

const commentSchema = new Schema<IComment>(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Post ID is required. Please provide the post ID.'],
      ref: 'Post',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required. Please provide the user ID.'],
      ref: 'User',
    },
    content: {
      type: String,
      required: [true, 'Content is required. Please provide your comment.'],
      minlength: [1, 'Content must be at least 1 character long.'],
      maxlength: [1000, 'Content cannot exceed 1000 characters.'],
    },
    replyTo: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Comment',
    },
    replies: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Comment',
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
