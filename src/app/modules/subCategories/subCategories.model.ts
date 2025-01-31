import { model, Schema } from 'mongoose';
import { TSubCategory } from './subCategories.interface';
import slugify from 'slugify';

// sub category schema --------------------------------------------------------
const subCategorySchema = new Schema<TSubCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    categoryName: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
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
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

subCategorySchema.pre('find', function (next) {
  this.populate('category').where({ 'category.isDeleted': { $ne: true } });
  next();
});

subCategorySchema.pre('findOne', function (next) {
  this.populate('category').where({ 'category.isDeleted': { $ne: true } });
  next();
});

subCategorySchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// sub category model
export const SubCategory = model<TSubCategory>(
  'SubCategory',
  subCategorySchema,
);
