import { model, Schema } from 'mongoose';
import { TCategory, TCategoryStatus } from './category.interface';
import { CATEGORY_STATUS } from './category.constants';

const categorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CATEGORY_STATUS) as TCategoryStatus[],
      default: CATEGORY_STATUS.Active,
    },
  },
  { timestamps: true },
);

// model
export const Category = model<TCategory>('Category', categorySchema);
