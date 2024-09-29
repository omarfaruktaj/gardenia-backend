import mongoose, { model, Schema } from 'mongoose';
import { PostType } from './postValidation';

const postSchema = new Schema<PostType>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title.'],
      minlength: [5, 'Title must be at least 5 characters long.'],
      maxlength: [100, 'Title cannot exceed 100 characters.'],
    },
    content: {
      type: String,
      required: [true, 'Please provide the content of the post.'],
      minlength: [20, 'Content must be at least 20 characters long.'],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
    images: {
      type: [String],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [
        true,
        "Author ID is required. Please provide the author's ID.",
      ],
    },
    votes: {
      type: Number,
      default: 0,
    },

    premium: {
      type: Boolean,
      default: false,
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

const Post = model<PostType>('Post', postSchema);

export default Post;
