import { Types } from 'mongoose';
import { AVAILABILITY_STATUS } from './productModel.constants';

export type TReview = {
  user: Types.ObjectId;
  rating: number;
  comment?: string;
};

export type TSpecifications = {
  color: string[];
  storage: string;
  display: string;
  camera: string;
  battery: string;
  weight: number;
  warranty?: string;
  dimensions: string;
};

export type TAvailabilityStatus =
  (typeof AVAILABILITY_STATUS)[keyof typeof AVAILABILITY_STATUS];

export type TProductModel = {
  name: string;
  slug: string;
  categoryName: string;
  description: string;
  price: number;
  discount?: number;
  discountPrice?: number;
  colors?: string[];
  specifications: TSpecifications;
  tags?: string[];
  availabilityStatus: TAvailabilityStatus;
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
