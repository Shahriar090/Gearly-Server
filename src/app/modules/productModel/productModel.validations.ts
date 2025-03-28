import { z } from 'zod';
import { AVAILABILITY_STATUS } from './productModel.constants';

// create product validation schema
const createProductValidationSchema = z.object({
  body: z.object({
    product: z.object({
      modelName: z.string().min(1, 'Product Name Is Required').trim(),
      slug: z.string().trim().min(1, 'Slug Is Required').optional(),
      brandName: z.string().min(1, 'Brand Name Is Required').trim(),
      description: z.string().min(1, 'Description Is Required').trim(),
      price: z
        .number()
        .refine((val) => val >= 0, { message: 'Price cannot be negative' }),
      discount: z
        .number()
        .refine((val) => val >= 0 && val <= 100, {
          message: 'Discount must be between 0 and 100',
        })
        .optional(),
      discountPrice: z.number().optional(),
      // specifications: specificationsSchema,
      tags: z.array(z.string()).default([]),
      availabilityStatus: z.enum(
        Object.values(AVAILABILITY_STATUS) as [string, ...string[]],
      ),
      stock: z.number().min(0, 'Stock Cannot Be Negative'),
      category: z.string().min(1, 'Category ID Is Required').optional(),
      subCategory: z.string().optional(),
      brand: z.string().trim().optional(),
      images: z
        .array(z.string().url('Invalid Image URL'))
        .nonempty('At least one image is required')
        .optional(),

      isFeatured: z.boolean().default(false),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

// update product validation schema
const updateProductValidationSchema = z.object({
  body: z.object({
    product: z.object({
      modelName: z
        .string()
        .min(1, 'Product Name Is Required')
        .trim()
        .optional(),
      slug: z.string().trim().min(1, 'Slug Is Required').optional(),
      brandName: z.string().min(1, 'Brand Name Is Required').trim().optional(),
      description: z
        .string()
        .min(1, 'Description Is Required')
        .trim()
        .optional(),
      price: z
        .number()
        .refine((val) => val >= 0, { message: 'Price cannot be negative' })
        .optional(),
      discount: z
        .number()
        .refine((val) => val >= 0 && val <= 100, {
          message: 'Discount must be between 0 and 100',
        })
        .optional(),
      discountPrice: z.number().optional(),

      tags: z.array(z.string()).default([]).optional(),
      availabilityStatus: z
        .enum(Object.values(AVAILABILITY_STATUS) as [string, ...string[]])
        .optional(),
      stock: z.number().min(0, 'Stock Cannot Be Negative').optional(),
      category: z.string().min(1, 'Category ID Is Required').optional(),
      subCategory: z.string().optional(),
      brand: z.string().trim().optional(),
      images: z.array(z.string().url('Invalid Image URL')).optional(),
      // ratings: z.number().min(0).max(5).default(0).optional(),
      // reviews: z.array(updateReviewsValidationSchema).default([]).optional(),
      isFeatured: z.boolean().default(false).optional(),
      isDeleted: z.boolean().default(false).optional(),
    }),
  }),
});

export const productValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
