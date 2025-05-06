import { model, Schema } from 'mongoose';
import {
  TCategory,
  TCategoryStatus,
  TFilteringFields,
} from './category.interface';
import { CATEGORY_STATUS } from './category.constants';
import slugify from 'slugify';

//**---------------------------------------------------------------------------
// Structure of the specifications:
// 1) Category has specifications which is an array
// 2) Each specification is a group with group name and fields
// 3) Fields is another array
// 4) Each field is an object with name, type and required.
// ** Array of groups => Each group has a name and an array of fields => Each field describes a specific detail like, screen size, ram etc.
// */-------------------------------------------------------------------------

const specificationFieldSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean'],
    required: true,
  },
  required: { type: Boolean, default: false },
});

const specificationGroupSchema = new Schema({
  groupName: { type: String, required: true },
  fields: { type: [specificationFieldSchema], required: true },
});

const filteringFieldsSchema = new Schema<TFilteringFields>({
  groupName: { type: String, required: true },
  value: { type: [String], required: true },
});

const categorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
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
    specifications: { type: [specificationGroupSchema], default: [] },
    filteringFields: [filteringFieldsSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// adding slug
categorySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
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
