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

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});
postSchema.virtual('allVotes', {
  ref: 'Vote',
  foreignField: 'post',
  localField: '_id',
});

const filterDeleted = function (
  this: mongoose.Query<PostType[], PostType>,
  next: () => void
) {
  this.where({ isDeleted: false });
  next();
};
postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

postSchema.pre('find', filterDeleted);
postSchema.pre('findOne', filterDeleted);

const Post = model<PostType>('Post', postSchema);

export default Post;
