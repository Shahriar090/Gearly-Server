import { model, Query, Schema } from 'mongoose';
import { TSubCategory } from './subCategories.interface';
import slugify from 'slugify';

// sub category schema --------------------------------------------------------
const subCategorySchema = new Schema<TSubCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryName: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
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

// Combine both transformations in a single pre-save hook
subCategorySchema.pre('save', function (next) {
  if (this.categoryName) {
    // Normalize categoryName (lowercase + replace spaces with hyphens)
    this.categoryName = this.categoryName.toLowerCase().replace(/\s+/g, '-');
  }

  if (!this.slug) {
    // Generate slug from name if not present
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  next();
});

// excluding soft deleted documents in the find queries
subCategorySchema.pre(/^find/, function (next) {
  const query = this as Query<TSubCategory[], TSubCategory>;
  query.setQuery({ ...query.getQuery(), isDeleted: false });
  // query.populate({ path: 'category', match: { isDeleted: false } });
  next();
});

// sub category model
export const SubCategory = model<TSubCategory>(
  'SubCategory',
  subCategorySchema,
);
