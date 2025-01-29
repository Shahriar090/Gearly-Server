import { CATEGORY_STATUS } from './category.constants';

export type TCategoryStatus =
  (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS];

export type TCategory = {
  name: string;
  description: string;
  imageUrl: string;
  status: TCategoryStatus;
};
