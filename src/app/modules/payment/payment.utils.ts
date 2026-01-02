import type { Types } from 'mongoose';
import type { TCategory } from '../category/category.interface';

export const isPopulatedCategory = (category: Types.ObjectId | TCategory | undefined): category is TCategory => {
	return typeof category === 'object' && category !== null && 'name' in category;
};
