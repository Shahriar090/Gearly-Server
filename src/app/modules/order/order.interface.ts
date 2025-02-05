import { Types } from 'mongoose';
import {
  ORDER_STATUS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
} from './order.constants';

export type TItems = {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
};

export type TAddress = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

export type TOrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export type TPaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export type TPaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export type TOrder = {
  user: Types.ObjectId;
  trackingId: string;
  items: TItems[];
  totalAmount: number;
  orderStatus: TOrderStatus;
  paymentStatus: TPaymentStatus;
  paymentMethod: TPaymentMethod;
  address: TAddress;
  isDeleted: boolean;
};
