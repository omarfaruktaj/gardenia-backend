import mongoose, { model, Schema } from 'mongoose';
import { IPost } from './postInterface';

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required. Please provide a title.'],
      minlength: [5, 'Title must be at least 5 characters long.'],
      maxlength: [100, 'Title cannot exceed 100 characters.'],
    },
    content: {
      type: String,
      required: [
        true,
        'Content is required. Please provide the content of the post.',
      ],
      minlength: [20, 'Content must be at least 20 characters long.'],
    },
    category: {
      type: String,
    },
    images: {
      type: [String],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

const Post = model<IPost>('Post', postSchema);

export default Post;
