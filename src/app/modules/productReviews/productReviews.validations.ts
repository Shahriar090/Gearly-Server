import { z } from 'zod';

// create review validation
const createReviewValidationSchema = z.object({
	body: z.object({
		review: z.object({
			user: z.string().optional(),
			product: z.string().optional(),
			rating: z.number().min(1, 'Rating Cannot Be Less Than 1').max(5, 'Rating Cannot Be More Than 5'),
			comment: z.string().trim(),
		}),
	}),
});

// update review validation
const updateReviewValidationSchema = z.object({
	body: z.object({
		review: z.object({
			user: z.string().optional(),
			product: z.string().optional(),
			rating: z.number().min(1, 'Rating Cannot Be Less Than 1').max(5, 'Rating Cannot Be More Than 5').optional(),
			comment: z.string().trim().optional(),
		}),
	}),
});

export const reviewValidations = {
	createReviewValidationSchema,
	updateReviewValidationSchema,
};
