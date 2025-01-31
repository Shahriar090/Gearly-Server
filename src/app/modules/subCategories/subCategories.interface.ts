import { Types } from 'mongoose';

export type TSubCategory = {
  name: string;
  categoryName: string;
  slug: string;
  description: string;
  imageUrl: string;
  category: Types.ObjectId;
  isDeleted: boolean;
};
