import mongoose from 'mongoose';
import { z } from 'zod';

const ObjectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

const createWishListValidationSchema = z.object({
  body: z.object({
    wishList: z.object({
      userId: ObjectIdSchema,
      productIds: z.array(ObjectIdSchema).nonempty({
        message: 'At Least One Product Is Required In The Wishlist',
      }),
    }),
  }),
});

export const wishlistValidations = { createWishListValidationSchema };
