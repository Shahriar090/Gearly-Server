import { z } from 'zod';
import { CATEGORY_STATUS } from './category.constants';

// For each field inside a group
const specificationFieldSchema = z.object({
	name: z.string().min(1, 'Specification field name is required'),
	type: z.enum(['string', 'number', 'boolean'], {
		errorMap: () => ({
			message: 'Invalid type, must be string, number, or boolean',
		}),
	}),
	required: z.boolean().default(false),
});

// For each group of fields
const specificationGroupSchema = z.object({
	groupName: z.string().min(1, 'Group name is required'),
	fields: z.array(specificationFieldSchema).min(1, 'At least one field is required in a group'),
});

const categoryBaseSchema = z.object({
	name: z.string().trim().min(1, 'Category Name Is Required'),
	description: z.string().trim().min(1, 'Description Is Required'),
	imageUrl: z.string().url('Invalid Image URL').min(1, 'Image Url Is Required').optional(),
	status: z.enum(Object.values(CATEGORY_STATUS) as [string, ...string[]]).optional(),
	specifications: z.array(specificationGroupSchema).optional(),
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
