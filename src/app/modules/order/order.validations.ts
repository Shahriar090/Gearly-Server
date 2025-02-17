import { z } from 'zod';
import {
  ORDER_STATUS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
} from './order.constants';

const createItemValidationSchema = z.object({
  product: z.string(),
  quantity: z.number().min(1, 'Quantity Must Be At Least 1'),
  price: z.number().min(0.0, 'Price Must Be A Positive Number').optional(),
  tax: z.number().optional(),
  shippingPrice: z.number().optional(),
});

const updateItemValidationSchema = z.object({
  product: z.string().optional(),
  quantity: z.number().min(1, 'Quantity Must Be At Least 1').optional(),
  price: z.number().min(0.0, 'Price Must Be A Positive Number').optional(),
  tax: z.number().optional(),
  shippingPrice: z.number().optional(),
});

const addressSchema = z.object({
  street: z.string().min(1, 'Street Is Required'),
  city: z.string().min(1, 'City Is Required'),
  postalCode: z.string().min(1, 'Postal Code Is Required'),
  country: z.string().min(1, 'Country Is Required'),
  contactNo: z.string().min(1, 'Contact No Is Required'),
  email: z.string().min(1, 'Email Is Required'),
});

// create order validation schema
const createOrderValidationSchema = z.object({
  body: z.object({
    order: z.object({
      user: z.string().optional(),
      trackingId: z.string().optional(),
      items: z
        .array(createItemValidationSchema)
        .nonempty('Order Must Have At Least One Item'),
      totalAmount: z
        .number()
        .min(0.0, 'Total Amount Must Be A Positive Number')
        .optional(),
      orderStatus: z
        .enum(Object.values(ORDER_STATUS) as [string, ...string[]])
        .optional(),
      paymentStatus: z
        .enum(Object.values(PAYMENT_STATUS) as [string, ...string[]])
        .optional(),
      paymentMethod: z
        .enum(Object.values(PAYMENT_METHODS) as [string, ...string[]])
        .optional(),
      address: addressSchema,
      isDeleted: z.boolean().optional(),
    }),
  }),
});

// update order validation schema
const updateOrderValidationSchema = z.object({
  body: z.object({
    order: z.object({
      user: z.string().optional(),
      trackingId: z.string().optional(),
      item: z
        .array(updateItemValidationSchema)
        .nonempty('Order Must Have At Least One Item')
        .optional(),
      totalAmount: z
        .number()
        .min(0, 'Total Amount Must Be A Positive Number')
        .optional(),
      orderStatus: z
        .enum(Object.values(ORDER_STATUS) as [string, ...string[]])
        .optional(),
      paymentStatus: z
        .enum(Object.values(PAYMENT_STATUS) as [string, ...string[]])
        .optional(),
      paymentMethod: z
        .enum(Object.values(PAYMENT_METHODS) as [string, ...string[]])
        .optional(),
      address: addressSchema.optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

export const orderValidations = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
