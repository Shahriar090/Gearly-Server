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

  if (products.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Some Products Not Found',
      'ProductsNotFound',
    );
  }

  // create a map for quick product lookup
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  // processing cart items
  const newItems = payload.items.map((newItem) => {
    if (newItem.quantity <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Quantity must be greater than 0',
        'InvalidQuantity',
      );
    }

    const product = productMap.get(newItem.product.toString());

    if (!product) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Product With ID ${newItem.product} Not Found`,
        'ProductNotFound',
      );
    }

    if (newItem.quantity > product.stock) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Only ${product.stock} units available for ${product.modelName}`,
        'OutOfStock',
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

// get user specific cart
const getCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'modelName brandName images price discountPrice availabilityStatus',
  });

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart Not Found', 'CartNotFound');
  }

  return cart;
};

// update cart item
const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart Not Found', 'CartNotFound');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex === -1) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Product Not In Cart',
      'ProductNotInCart',
    );
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Product Not Found',
      'ProductNotFound',
    );
  }

  if (quantity > product.stock) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Only ${product.stock} Units Available`,
      'OutOfStock',
    );
  }

  const price = product.discountPrice ?? product.price;
  const discount = product.price - price;

  cart.items[itemIndex].quantity = quantity;
  cart.items[itemIndex].price = price;
  cart.items[itemIndex].discount = discount;
  cart.items[itemIndex].saved = discount * quantity;
  cart.items[itemIndex].totalPrice = (price - discount) * quantity;

  const totals = calculateCartTotals(cart.items);

  Object.assign(cart, totals);

  return await cart.save();
};

// remove cart item
const removeCartItem = async (userId: string, productId: string) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart Not Found', 'CartNotFound');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex === -1) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Product Not In Cart',
      'ProductNotInCart',
    );
  }

  cart.items.splice(itemIndex, 1);
  Object.assign(cart, calculateCartTotals(cart.items));

  return await cart.save();
};

// clear cart
const clearCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart Not Found', 'CartNotFound');
  }

  cart.items = [];
  cart.totalAmount = 0;
  cart.discount = 0;
  cart.totalSaved = 0;
  cart.shippingCharge = 0;
  cart.grandTotal = 0;
  cart.tax = 0;

  return await cart.save();
};

export const cartServices = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
