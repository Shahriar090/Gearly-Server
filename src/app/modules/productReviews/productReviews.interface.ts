import type { Types } from 'mongoose';

export type TProductReview = {
	user: Types.ObjectId;
	product: Types.ObjectId;
	rating: number;
	comment?: string;
	isDeleted: boolean;
};
