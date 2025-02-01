import { Types } from 'mongoose';

export type TReview = {
  user: Types.ObjectId;
  rating: number;
  comment?: string;
};

export type TProductModel = {
  name: string;
  slug: string;
  categoryName: string;
  description: string;
  price: number;
  discount?: number;
  stock: number;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  brand: string;
  images: string[];
  ratings?: number;
  reviews?: TReview[];
  isFeatured: boolean;
  isDeleted: boolean;
};
