import { CATEGORY_STATUS } from './category.constants';

export type TCategoryStatus =
  (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS];

export type TSpecifications = {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
};

export type TCategory = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  status: TCategoryStatus;
  specifications?: TSpecifications[];
  isDeleted: boolean;
};
