import { model, Schema } from 'mongoose';
import { TWishList } from './wishlist.interface';

const wishListSchema = new Schema<TWishList>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true },
);

// model
const WishList = model<TWishList>('WishList', wishListSchema);

export default WishList;
