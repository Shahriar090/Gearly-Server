import { Types } from 'mongoose';
import { AVAILABILITY_STATUS } from './productModel.constants';

// export type TSpecifications = {
//   colors: string[];
//   storage: string;
//   display: string;
//   camera: string;
//   battery: string;
//   weight: number;
//   warranty?: string;
//   dimensions: string;
// };

// Experimental : Trying to make the specifications dynamic for different products.

export type TSpecifications = Record<
  string,
  string | string[] | number | boolean
>;

export type TAvailabilityStatus =
  (typeof AVAILABILITY_STATUS)[keyof typeof AVAILABILITY_STATUS];

export type TProductModel = {
  name: string;
  slug: string;
  subCategoryName: string;
  description: string;
  price: number;
  discount?: number;
  discountPrice?: number;
  saved: number;
  specifications?: TSpecifications;
  tags?: string[];
  availabilityStatus: TAvailabilityStatus;
  stock: number;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  brand: string;
  images: string[];
  ratings?: number;
  isFeatured: boolean;
  isDeleted: boolean;
};
