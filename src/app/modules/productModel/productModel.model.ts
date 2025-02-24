import { model, Schema } from 'mongoose';
import { TProductModel } from './productModel.interface';
import slugify from 'slugify';
import { AVAILABILITY_STATUS } from './productModel.constants';

// specifications schema => Previous
// const specificationsSchema = new Schema<
//   Record<string, string | string[] | boolean | number>
// >({
//   colors: { type: [String], required: true },
//   storage: { type: String, required: true },
//   display: { type: String, required: true },
//   camera: { type: String, required: true },
//   battery: { type: String, required: true },
//   weight: { type: Number, required: true },
//   warranty: { type: String },
//   dimensions: { type: String, required: true },
// });

// Dynamic specifications schema : Experimental
const specificationsSchema = new Schema<
  Record<string, string | string[] | number | boolean>
>({}, { _id: false });

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
    specifications: { type: specificationsSchema, required: false },
    tags: { type: [String], default: [] },
    availabilityStatus: {
      type: String,
      enum: Object.values(AVAILABILITY_STATUS), // Enum from the AVAILABILITY_STATUS constants
      required: true,
    },
    stock: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    brand: { type: String, required: true },
    images: { type: [String], required: true },
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

// model
export const Product = model<TProductModel>('Product', productSchema);
