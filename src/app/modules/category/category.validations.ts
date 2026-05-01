import { z } from 'zod';
import { CATEGORY_STATUS } from './category.constants';

const categoryBaseSchema = z.object({
	name: z.string().trim().min(1, 'Category Name Is Required'),
	description: z.string().trim().min(1, 'Description Is Required'),
	imageUrl: z.string().url('Invalid Image URL').min(1, 'Image Url Is Required').optional(),
	status: z.enum(Object.values(CATEGORY_STATUS) as [string, ...string[]]).optional(),
	isDeleted: z.boolean().optional(),
});

// create
const createCategoryValidationSchema = z.object({
	body: z.object({
		category: categoryBaseSchema,
	}),
});

// update
const updateCategoryValidationSchema = z.object({
	body: z.object({
		category: categoryBaseSchema.partial(),
	}),
});

export const categoryValidations = {
	createCategoryValidationSchema,
	updateCategoryValidationSchema,
};
