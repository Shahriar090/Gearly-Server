import { model, Schema } from 'mongoose';
import {
  TAddress,
  TItems,
  TOrder,
  TPaymentMethod,
  TPaymentStatus,
  TStatus,
} from './order.interface';
import {
  ORDER_STATUS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
} from './order.constants';

const itemSchema = new Schema<TItems>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const addressSchema = new Schema<TAddress>({
  street: String,
  city: String,
  postalCode: String,
  country: String,
});

const orderSchema = new Schema<TOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    trackingId: {
      type: String,
      unique: true,
    },
    items: [itemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS) as TStatus[],
      default: ORDER_STATUS.Pending,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS) as TPaymentStatus[],
      default: PAYMENT_STATUS.Pending,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS) as TPaymentMethod[],
    },
    address: addressSchema,
  },
  { timestamps: true },
);

// model
export const Order = model<TOrder>('Order', orderSchema);
