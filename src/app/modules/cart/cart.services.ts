import { TCart } from './cart.interface';
import { Cart } from './cart.model';

const calculateCartTotals = (cart: TCart) => {
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  cart.tax = cart.totalAmount * 0.1;
  cart.discount = cart.totalAmount > 100 ? 10 : 0;
  cart.shippingCharge = cart.totalAmount > 1000 ? 100 : 200;
};

// create a new cart (for the first time for a user)
const createCart = async (userId: string) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [], totalAmount: 0 });
    await cart.save();
  }
  return cart;
};

export const cartServices = { createCart };
