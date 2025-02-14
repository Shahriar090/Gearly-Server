import AppError from '../../errors/appError';
import { Product } from '../productModel/productModel.model';
import { TCart } from './cart.interface';
import { Cart } from './cart.model';
import { calculateCartTotals, mergeCartItems } from './cart.utils';
import httpStatus from 'http-status';

const addToCart = async (userId: string, payload: TCart) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  // extracting product IDs from the payload
  const productIds = payload.items.map((item) => item.product);

  // fetch all required products in a single DB query
  const products = await Product.find({ _id: { $in: productIds } });

  // create a map for quick product lookup
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  // processing cart items
  const newItems = payload.items.map((newItem) => {
    const product = productMap.get(newItem.product.toString());

    if (!product) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Product With ID ${newItem.product} Not Found`,
        'ProductNotFound',
      );
    }

    const price = product.discountPrice ?? product.price;
    const discount = product.price - price;

    return {
      product: newItem.product,
      quantity: newItem.quantity,
      price,
      discount,
      totalPrice: price * newItem.quantity,
      saved: discount * newItem.quantity,
    };
  });

  // merging new items with existing cart items
  cart.items = mergeCartItems(cart.items, newItems);

  //  calculate cart totals
  const updatedCart = calculateCartTotals(cart.items);

  // update cart
  Object.assign(cart, updatedCart);

  return await cart.save();
};

export const cartServices = { addToCart };
