import { model, Schema } from 'mongoose';
import { CategoryType } from './categoryValidation';

const categorySchema = new Schema<CategoryType>(
  {
    name: {
      type: String,
      required: [true, 'Name is required. Please provide a category name.'],
      minlength: [3, 'Name must be at least 3 characters long.'],
      maxlength: [50, 'Name cannot exceed 50 characters.'],
      unique: true,
    },
    description: {
      type: String,
      required: [
        true,
        'Description is required. Please provide a description for the category.',
      ],
      minlength: [10, 'Description must be at least 10 characters long.'],
      maxlength: [200, 'Description cannot exceed 200 characters.'],
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

const Category = model<CategoryType>('Category', categorySchema);

export default Category;
