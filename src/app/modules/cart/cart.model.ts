import { model, Schema } from 'mongoose';
import { TCart, TCartItems, TCartStatus } from './cart.interface';
import { CART_STATUS } from './cart.constant';

// items schema
const itemsSchema = new Schema<TCartItems>({
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
  totalPrice: {
    type: Number,
  },
  itemImg: {
    type: String,
  },
  variant: {
    type: String,
  },
});

const cartSchema = new Schema<TCart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [itemsSchema],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    shippingCharge: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(CART_STATUS) as TCartStatus[],
      default: CART_STATUS.Active,
    },
  },
  { timestamps: true },
);

// model
export const Cart = model<TCart>('Cart', cartSchema);
