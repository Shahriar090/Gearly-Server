import { Types } from 'mongoose';

// model (iphone 16)
export type TProductModel = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  subCategory: Types.ObjectId;
};
