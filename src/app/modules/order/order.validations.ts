import { z } from 'zod';
import {
  ORDER_STATUS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  DELIVERY_METHODS,
} from './order.constants';

const createItemValidationSchema = z.object({
  product: z
    .string()
    .min(1, 'You Have To Add At Least One Product To Place An Order'),
  quantity: z.number().min(1, 'Quantity Must Be At Least 1'),
  price: z.number().min(0, 'Price Must Be A Positive Number').optional(),
  discount: z.number().min(0).optional(),
  saved: z.number().min(0).optional(),
  totalPrice: z.number().min(0).optional(),
});

const updateItemValidationSchema = createItemValidationSchema.partial();

const customerInfoSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last Name is required'),
  address: z.string().min(1, 'Address is required'),
  mobile: z.string().min(1, 'Mobile number is required'),
  email: z.string().email('Invalid email address'),
  city: z.string().min(1, 'City is required'),
  zone: z.string().min(1, 'Zone is required'),
  comment: z.string().optional(),
});

// Create Order Validation Schema
const createOrderValidationSchema = z.object({
  body: z.object({
    order: z.object({
      user: z.string().optional(),
      trackingId: z.string().optional(),
      items: z
        .array(createItemValidationSchema)
        .nonempty('Order Must Have At Least One Item'),
      discount: z.number().min(0).optional(),
      totalSaved: z.number().min(0).optional(),
      tax: z.number().min(0).optional(),
      shippingCharge: z.number().min(0).optional(),
      grandTotal: z.number().min(0).optional(),
      orderStatus: z
        .enum(Object.values(ORDER_STATUS) as [string, ...string[]])
        .optional(),
      paymentStatus: z
        .enum(Object.values(PAYMENT_STATUS) as [string, ...string[]])
        .optional(),
      paymentMethod: z
        .enum(Object.values(PAYMENT_METHODS) as [string, ...string[]])
        .optional(),
      deliveryMethod: z
        .enum(Object.values(DELIVERY_METHODS) as [string, ...string[]])
        .optional(),
      customerInfo: customerInfoSchema,
      isDeleted: z.boolean().optional(),
    }),
  }),
});

// Update Order Validation Schema
const updateOrderValidationSchema = z.object({
  body: z.object({
    order: z.object({
      user: z.string().optional(),
      trackingId: z.string().optional(),
      items: z
        .array(updateItemValidationSchema)
        .nonempty('Order Must Have At Least One Item')
        .optional(),
      discount: z.number().min(0).optional(),
      totalSaved: z.number().min(0).optional(),
      tax: z.number().min(0).optional(),
      shippingCharge: z.number().min(0).optional(),
      grandTotal: z.number().min(0).optional(),
      orderStatus: z
        .enum(Object.values(ORDER_STATUS) as [string, ...string[]])
        .optional(),
      paymentStatus: z
        .enum(Object.values(PAYMENT_STATUS) as [string, ...string[]])
        .optional(),
      paymentMethod: z
        .enum(Object.values(PAYMENT_METHODS) as [string, ...string[]])
        .optional(),
      deliveryMethod: z
        .enum(Object.values(DELIVERY_METHODS) as [string, ...string[]])
        .optional(),
      customerInfo: customerInfoSchema.optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

export const orderValidations = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
