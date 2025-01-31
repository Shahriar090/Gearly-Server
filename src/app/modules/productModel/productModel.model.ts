import { model, Schema } from 'mongoose';
import slugify from 'slugify';
import { TProductModel } from './productModel.interface';

// model schema (each brand's model. For example, Galaxy S23 Ultra From Samsung)

const productModelSchema = new Schema<TProductModel>({
  name: {
    type: String,
    required: true,
    trim: true,
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
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true,
  },
});

productModelSchema.pre('find', function (next) {
  this.populate('subCategory').where({
    'subCategory.category.isDeleted': { $ne: true },
  });
  next();
});

productModelSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
// brand specific model schema
export const ProductModel = model<TProductModel>(
  'ProductModel',
  productModelSchema,
);
