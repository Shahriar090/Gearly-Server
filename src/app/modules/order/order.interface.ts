import { Types } from 'mongoose';
import {
  DELIVERY_METHODS,
  ORDER_STATUS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
} from './order.constants';

export type TItems = {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  discount?: number;
  saved: number;
  totalPrice: number;
  itemImg?: string;
  variant?: string;
};

export type TCustomerInfo = {
  firstName: string;
  middleName?: string;
  lastName: string;
  address: string;
  mobile: string;
  email: string;
  city: string;
  zone: string;
  comment?: string;
};

export type TOrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export type TPaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export type TPaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export type TDeliveryMethod =
  (typeof DELIVERY_METHODS)[keyof typeof DELIVERY_METHODS];

export type TOrder = {
  user: Types.ObjectId;
  trackingId: string;
  items: TItems[];
  totalAmount: number;
  discount: number;
  totalSaved: number;
  tax: number;
  shippingCharge: number;
  grandTotal: number;
  orderStatus: TOrderStatus;
  paymentStatus: TPaymentStatus;
  paymentMethod: TPaymentMethod;
  deliveryMethod: TDeliveryMethod;
  customerInfo: TCustomerInfo;
  isDeleted: boolean;
};
