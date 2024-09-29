import { model, Schema } from 'mongoose';
import { IFavorite } from './favoriteInterface';

const FavoriteSchema: Schema = new Schema<IFavorite>(
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

const Favorite = model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;
