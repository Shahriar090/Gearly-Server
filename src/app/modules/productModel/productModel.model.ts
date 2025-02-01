import { model, Schema } from 'mongoose';
import { TProductModel, TReview } from './productModel.interface';

const reviewSchema = new Schema<TReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const productModelSchema = new Schema<TProductModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      min: 0,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
    brand: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// This logic will automatically updates product ratings based on user reviews. That's why no need to manually calculate average rating in the frontend/backend.
productModelSchema.pre('save', function (next) {
  if (this.isModified('reviews')) {
    if (!this.reviews || this.reviews.length === 0) {
      this.ratings = 0;
    } else {
      const total = this.reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      this.ratings = total / this.reviews.length;
    }
  }
  next();
});

// model
export const Product = model<TProductModel>('Product', productModelSchema);
