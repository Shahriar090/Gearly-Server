import type { Types } from 'mongoose';
import type { AVAILABILITY_STATUS } from './productModel.constants';

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

// export type TSpecifications = Record<string, string | string[] | number | boolean>;

export type TAvailabilityStatus = (typeof AVAILABILITY_STATUS)[keyof typeof AVAILABILITY_STATUS];

export type TProductModel = {
	modelName: string;
	slug: string;
	brandName: string;
	description: string;
	price: number;
	discount?: number;
	discountPrice?: number;
	saved: number;
	tags?: string[];
	availabilityStatus: TAvailabilityStatus;
	stock: number;
	categoryId?: Types.ObjectId;
	brand: string;
	images: string[];
	reviews?: Types.ObjectId[];
	ratings?: number;
	isFeatured: boolean;
	isDeleted: boolean;
	attributes?: Map<string, any>;
	sku?: string;
	status: ProductStatus;
	createdAt: Date;
	updatedAt: Date;
};

export enum ProductStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	DRAFT = 'draft',
}

export interface CreateProductInput {
	name: string;
	description?: string;
	categoryId: string;
	price: number;
	stock?: number;
	images?: string[];
	brand?: string;
	sku?: string;
	status?: ProductStatus;
	attributes?: Record<string, any>;
}
