import { model, Schema } from 'mongoose';
import { TProductReview } from './productReviews.interface';

const productReviewSchema = new Schema<TProductReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    comment: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Review = model<TProductReview>(
  'ProductReview',
  productReviewSchema,
);
