import { Types } from 'mongoose';

// sub category is referring to the brands
export type TSubCategory = {
  brandName: string;
  categoryName: string;
  slug: string;
  description: string;
  imageUrl: string;
  category: Types.ObjectId;
  isDeleted: boolean;
};
