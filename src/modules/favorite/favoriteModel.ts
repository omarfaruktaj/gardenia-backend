import { model, Schema } from 'mongoose';
import { FavoriteType } from './favoriteValidation';

const FavoriteSchema: Schema = new Schema<FavoriteType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'Please provide the User ID.'],
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      required: [true, 'Please provide the post ID.'],
      ref: 'Post',
    },
  },
  { timestamps: true }
);

const Favorite = model<FavoriteType>('Favorite', FavoriteSchema);

export default Favorite;
