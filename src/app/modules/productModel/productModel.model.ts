import { model, Schema } from 'mongoose';
import { TProductModel, TSpecifications } from './productModel.interface';
import slugify from 'slugify';
import { AVAILABILITY_STATUS } from './productModel.constants';

// specifications schema
const specificationsSchema = new Schema<TSpecifications>({
  colors: { type: [String], required: true },
  storage: { type: String, required: true },
  display: { type: String, required: true },
  camera: { type: String, required: true },
  battery: { type: String, required: true },
  weight: { type: Number, required: true },
  warranty: { type: String },
  dimensions: { type: String, required: true },
});

const productSchema = new Schema<TProductModel>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    subCategoryName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number },
    discountPrice: { type: Number },
    specifications: { type: specificationsSchema, required: true },
    tags: { type: [String], default: [] },
    availabilityStatus: {
      type: String,
      enum: Object.values(AVAILABILITY_STATUS), // Enum from the AVAILABILITY_STATUS constants
      required: true,
    },
    stock: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Assuming you have a Category model
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    brand: { type: String, required: true },
    images: { type: [String], required: true },
    isFeatured: { type: Boolean, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// This logic will automatically updates product ratings based on user reviews. That's why no need to manually calculate average rating in the frontend/backend.
// productSchema.pre('save', function (next) {
//   if (this.isModified('reviews')) {
//     if (!this.reviews || this.reviews.length === 0) {
//       this.ratings = 0;
//     } else {
//       const total = this.reviews.reduce(
//         (sum, review) => sum + review.rating,
//         0,
//       );
//       this.ratings = total / this.reviews.length;
//     }
//   }
//   next();
// });

// calculating discount price
productSchema.pre('save', function (next) {
  if (this.isModified('price') || this.isModified('discount')) {
    if (this.discount && this.discount > 0 && this.discount <= 100) {
      this.discountPrice = this.price - (this.price * this.discount) / 100;
    } else {
      this.discountPrice = this.price;
    }
  }
  next();
});

// adding slug
productSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// model
export const Product = model<TProductModel>('Product', productSchema);
