import { Types } from 'mongoose';
import { TCategory } from '../category/category.interface';

export const isPopulatedCategory = (
  category: Types.ObjectId | TCategory | undefined,
): category is TCategory => {
  return (
    typeof category === 'object' && category !== null && 'name' in category
  );
};
