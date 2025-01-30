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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// excluding deleted categories (documents) from get operations
/**NOTE: If the query explicitly targets the deleted docs (for example, restoring deleted docs), it will work as the query. Otherwise, it will filter out all the deleted docs for find operations. */

categorySchema.pre('find', function (next) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query = this as any;
  if (query._conditions && query._conditions.isDeleted === true) {
    return next();
  }
  this.where({ isDeleted: { $ne: true } });
  next();
});

categorySchema.pre('findOne', function (next) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query = this as any;

  if (query._conditions && query._conditions.isDeleted === true) {
    return next();
  }
  this.where({ isDeleted: { $ne: true } });
  next();
});

// model
export const Category = model<TCategory>('Category', categorySchema);
