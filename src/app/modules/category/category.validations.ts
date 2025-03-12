import { z } from 'zod';
import { CATEGORY_STATUS } from './category.constants';

const specificationSchema = z.object({
  name: z.string().min(1, 'Specification name is required'), // Ensure name is a non-empty string
  type: z.enum(['string', 'number', 'boolean'], {
    errorMap: () => ({
      message: 'Invalid type, must be string, number, or boolean',
    }),
  }),
  required: z.boolean().default(false),
});

// create
const createCategoryValidationSchema = z.object({
  body: z.object({
    category: z.object({
      name: z.string().trim().min(1, 'Category Name Is Required'),
      description: z.string().trim().min(1, 'Description Is Required'),
      status: z
        .enum(Object.values(CATEGORY_STATUS) as [string, ...string[]])
        .optional(),
      specifications: z.array(specificationSchema).optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

// update
const updateCategoryValidationSchema = z.object({
  body: z.object({
    category: z.object({
      name: z.string().trim().min(1, 'Category Name Is Required').optional(),
      description: z
        .string()
        .trim()
        .min(1, 'Description Is Required')
        .optional(),
      imageUrl: z
        .string()
        .url('Invalid Image URL')
        .min(1, 'Image Url Is Required')
        .optional(),
      status: z
        .enum(Object.values(CATEGORY_STATUS) as [string, ...string[]])
        .optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

export const categoryValidations = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
