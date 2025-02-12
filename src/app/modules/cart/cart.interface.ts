import { Types } from 'mongoose';
import { CART_STATUS } from './cart.constant';

export type TCartItems = {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  totalPrice: number;
  itemImg?: string;
  variant?: string;
};

export type TCartStatus = (typeof CART_STATUS)[keyof typeof CART_STATUS];

export type TCart = {
  user: Types.ObjectId;
  items: TCartItems[];
  totalAmount: number;
  discount: number;
  tax: number;
  shippingCharge: number;
  status: TCartStatus;
};
