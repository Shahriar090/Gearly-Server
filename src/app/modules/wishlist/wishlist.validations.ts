import { z } from 'zod';

// const ObjectIdSchema = z
//   .string()
//   .refine((val) => mongoose.Types.ObjectId.isValid(val), {
//     message: 'Invalid ObjectId',
//   });

const createWishListValidationSchema = z.object({
  body: z.object({
    wishList: z.object({
      products: z
        .array(z.string())
        .nonempty({ message: 'At Least One Item Is Required In Wishlist' }),
    }),
  }),
});

export const wishlistValidations = { createWishListValidationSchema };
