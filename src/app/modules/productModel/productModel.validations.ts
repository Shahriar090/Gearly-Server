import { z } from 'zod';

// create review schema
const createReviewSchema = z.object({
  user: z.string().min(1, 'User ID Is Required'),
  rating: z.number().min(0).max(5, 'Rating Cannot Be More Than 5'),
  comment: z.string().trim().optional(),
});

// update review schema
const updateReviewsSchema = z.object({
  user: z.string().min(1, 'User ID Is Required').optional(),
  rating: z.number().min(0).max(5, 'Rating Cannot Be More Than 5').optional(),
  comment: z.string().trim().optional(),
});

// create product validation schema
const createProductValidationSchema = z.object({
  body: z.object({
    product: z.object({
      name: z.string().min(1, 'Product Name Is Required').trim(),
      slug: z.string().trim().min(1, 'Slug Is Required').optional(),
      categoryName: z.string().min(1, 'Category Name Is Required').trim(),
      description: z.string().min(1, 'Description Is Required').trim(),
      price: z.number().min(0, 'Price Must Be At Least 0'),
      discount: z
        .number()
        .refine((val) => val >= 0 && val <= 100, {
          message: 'Discount must be between 0 and 100',
        })
        .optional(),
      stock: z.number().min(0, 'Stock Cannot Be Negative'),
      category: z.string().min(1, 'Category ID Is Required').optional(),
      subCategory: z.string().optional(),
      brand: z.string().trim().optional(),
      images: z
        .array(z.string().url('Invalid Image URL'))
        .nonempty('At least one image is required'),
      ratings: z.number().min(0).max(5).default(0),
      reviews: z.array(createReviewSchema).default([]),
      isFeatured: z.boolean().default(false),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

// update product validation schema
const updateProductValidationSchema = z.object({
  body: z.object({
    product: z.object({
      name: z.string().min(1, 'Product Name Is Required').trim().optional(),
      slug: z.string().trim().min(1, 'Slug Is Required').optional(),
      categoryName: z
        .string()
        .min(1, 'Category Name Is Required')
        .trim()
        .optional(),
      description: z
        .string()
        .min(1, 'Description Is Required')
        .trim()
        .optional(),
      price: z.number().min(0, 'Price Must Be At Least 0').optional(),
      discount: z
        .number()
        .refine((val) => val >= 0 && val <= 100, {
          message: 'Discount must be between 0 and 100',
        })
        .optional(),
      stock: z.number().min(0, 'Stock Cannot Be Negative').optional(),
      category: z.string().min(1, 'Category ID Is Required').optional(),
      subCategory: z.string().optional(),
      brand: z.string().trim().optional(),
      images: z
        .array(z.string().url('Invalid Image URL'))
        .nonempty('At least one image is required'),

      ratings: z.number().min(0).max(5).default(0).optional(),
      reviews: z.array(updateReviewsSchema).default([]).optional(),
      isFeatured: z.boolean().default(false).optional(),
      isDeleted: z.boolean().default(false).optional(),
    }),
  }),
});

export const productValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
