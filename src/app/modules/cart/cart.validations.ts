import mongoose from 'mongoose';
import { z } from 'zod';
import { CART_STATUS } from './cart.constant';

// Zod validation for ObjectId
const ObjectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

//   create cart items ----------------------
const createCartItemsValidationSchema = z.object({
  product: ObjectIdSchema,
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price cannot be negative'),
  totalPrice: z.number().min(0, 'Total price cannot be negative').optional(),
  itemImg: z.string().optional(),
  variant: z.string().optional(),
});
//   update cart items ----------------------
const updateCartItemsValidationSchema = z.object({
  product: ObjectIdSchema,
  quantity: z.number().min(1, 'Quantity must be at least 1').optional(),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  totalPrice: z.number().min(0, 'Total price cannot be negative').optional(),
  itemImg: z.string().optional(),
  variant: z.string().optional(),
});

// create cart validation schema
const createCartValidationSchema = z.object({
  body: z.object({
    cart: z.object({
      user: ObjectIdSchema,
      items: z.array(createCartItemsValidationSchema),
      totalAmount: z.number().min(0, 'Total amount cannot be negative'),
      discount: z.number().min(0, 'Discount cannot be negative').default(0),
      tax: z.number().min(0, 'Tax cannot be negative').default(0),
      shippingCharge: z
        .number()
        .min(0, 'Shipping charge cannot be negative')
        .default(0),
      status: z.enum(Object.values(CART_STATUS) as [string, ...string[]]),
    }),
  }),
});

// update cart validation schema
const updateCartValidationSchema = z.object({
  body: z.object({
    cart: z.object({
      user: ObjectIdSchema,
      items: z.array(updateCartItemsValidationSchema).optional(),
      totalAmount: z.number().min(0, 'Total amount cannot be negative'),
      discount: z.number().min(0, 'Discount cannot be negative').default(0),
      tax: z.number().min(0, 'Tax cannot be negative').default(0),
      shippingCharge: z
        .number()
        .min(0, 'Shipping charge cannot be negative')
        .default(0),
      status: z.enum(Object.values(CART_STATUS) as [string, ...string[]]),
    }),
  }),
});

// validation for creating a new cart

/**
 * .shape allows us to access the structure inside zod object
 * .shape.body access the body object
 * .shape.body.shape.cart access the cart object
 */
const createNewCartValidationSchema =
  createCartValidationSchema.shape.body.shape.cart.pick({
    user: true,
    items: true,
  });
// validation for updating a new cart
const updateNewCartValidationSchema = createCartValidationSchema.partial();

export const cartValidations = {
  createCartValidationSchema,
  updateCartValidationSchema,
  createNewCartValidationSchema,
  updateNewCartValidationSchema,
};
