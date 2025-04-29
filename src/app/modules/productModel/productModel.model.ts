/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema } from 'mongoose';
import { TProductModel } from './productModel.interface';
import slugify from 'slugify';
import { AVAILABILITY_STATUS } from './productModel.constants';
import { Category } from '../category/category.model';

const productSpecificationFieldSchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true }, // Can be string, number, boolean, etc.
  },
  { _id: false },
);

const productSpecificationGroupSchema = new Schema(
  {
    groupName: { type: String },
    fields: { type: [productSpecificationFieldSchema], required: true },
  },
  { _id: false },
);
const productSchema = new Schema<TProductModel>(
  {
    modelName: { type: String, required: true },
    slug: { type: String, unique: true },
    brandName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number },
    discountPrice: { type: Number },
    saved: { type: Number },
    specifications: {
      type: [productSpecificationGroupSchema],
      required: true,
    },

    tags: { type: [String], default: [] },
    availabilityStatus: {
      type: String,
      enum: Object.values(AVAILABILITY_STATUS),
      required: true,
    },
    stock: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    brand: { type: String, required: false },
    images: { type: [String] },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    isFeatured: { type: Boolean, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// calculating discount price
productSchema.pre('save', function (next) {
  if (this.isModified('price') || this.isModified('discount')) {
    if (this.discount && this.discount > 0 && this.discount <= 100) {
      this.discountPrice = this.price - (this.price * this.discount) / 100;
      this.discountPrice = Math.round(this.discountPrice);
      this.saved = Math.round(this.price - this.discountPrice);
    } else {
      this.discountPrice = this.price;
      this.saved = 0;
    }
  }
  next();
});

// pre save hook to convert tags to lowercase
productSchema.pre('save', function (next) {
  if (this.tags && Array.isArray(this.tags)) {
    this.tags = this.tags.map((tag) => tag.toLowerCase());
  }
  next();
});

// adding slug
productSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = slugify(this.modelName, { lower: true, strict: true });
  }
  next();
});

// Ensuring all required specifications are included (Updated for the new structure)
productSchema.pre('save', async function (next) {
  try {
    if (!this.category) {
      return next(new Error('Category is missing.'));
    }

    const category = await Category.findById(this.category);

    if (!category || !Array.isArray(category.specifications)) {
      return next(new Error('Category or its specifications are missing.'));
    }

    if (!this.specifications || !Array.isArray(this.specifications)) {
      return next(new Error('Product specifications are missing.'));
    }

    // Extract field names from product specifications
    const productSpecs = this.specifications.flatMap((group: any) =>
      Array.isArray(group.fields)
        ? group.fields.map((field: any) => field.name)
        : [],
    );

    const requiredSpecs = category.specifications
      .filter((spec: { name: string; required: boolean }) => spec.required)
      .map((spec) => spec.name);

    const missingSpecs = requiredSpecs.filter(
      (spec: string) => !productSpecs.includes(spec),
    );

    if (missingSpecs.length > 0) {
      return next(
        new Error(
          `Missing Required Specifications: ${missingSpecs.join(', ')}`,
        ),
      );
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

// model
export const Product = model<TProductModel>('Product', productSchema);
