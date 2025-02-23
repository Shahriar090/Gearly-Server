import { z } from 'zod';

// create validation
const createSubCategoryValidationSchema = z.object({
  body: z.object({
    subCategory: z.object({
      brandName: z.string().trim().min(1, 'Sub Category Name Is Required'),
      categoryName: z.string().trim().min(1, 'Category Is Required'),
      slug: z.string().trim().optional(),
      description: z.string().trim().min(1, 'Description Is Required'),
      imageUrl: z
        .string()
        .trim()
        .url('Invalid Image Url')
        .min(1, 'Image Is Required'),
      category: z.string().trim().min(1).optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

// update validation
const updateSubCategoryValidationSchema = z.object({
  body: z.object({
    subCategory: z.object({
      brandName: z
        .string()
        .trim()
        .min(1, 'Sub Category Name Is Required')
        .optional(),

      description: z
        .string()
        .trim()
        .min(1, 'Description Is Required')
        .optional(),
      imageUrl: z
        .string()
        .trim()
        .url('Invalid Image Url')
        .min(1, 'Image Is Required')
        .optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

export const subCategoryValidations = {
  createSubCategoryValidationSchema,
  updateSubCategoryValidationSchema,
};
