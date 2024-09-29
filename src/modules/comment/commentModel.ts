import mongoose, { model, Schema } from 'mongoose';
import { CommentType } from './commentValidation';

const commentSchema = new Schema<CommentType>(
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
    content: {
      type: String,
      required: [true, 'Please provide your comment.'],
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model<CommentType>('Comment', commentSchema);

export default Comment;
