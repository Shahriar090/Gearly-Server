import { ObjectId } from 'mongodb';
import type { CATEGORY_STATUS } from './category.constants';

export type TCategoryStatus = (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS];

export type TCategory = {
	parentId?: ObjectId;
	name: string;
	slug: string;
	description: string;
	imageUrl: string;
	status: TCategoryStatus;
	isDeleted: boolean;
};
