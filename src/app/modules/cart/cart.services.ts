import AppError from '../../errors/appError';
import { Product } from '../productModel/productModel.model';
import { TCart } from './cart.interface';
import { Cart } from './cart.model';
import { calculateCartTotals } from './cart.utils';
import httpStatus from 'http-status';

const addToCart = async (userId: string, payload: TCart) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  let cartTotalSaved = 0;

  // loop through each incoming items from client

  for (const newItem of payload.items) {
    // fetching product details from DB
    const product = await Product.findById(newItem.product);

    if (!product) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Product With ID ${newItem.product} Not Found`,
      );
    }

    // use the discount price if available
    const price =
      product.discountPrice && product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    const discount = product.discountPrice ? product.discount : 0;

    // check if the item already exists in the cart
    const isItemExist = cart.items.find(
      (item) => item.product.toString() === newItem.product.toString(),
    );

    const originalPrice = product.price * newItem.quantity;
    const saved = originalPrice - price * newItem.quantity;

    if (isItemExist) {
      // if item already exists, increase its quantity
      isItemExist.quantity += newItem.quantity;

      // update the total price for this item
      isItemExist.price = price;
      isItemExist.totalPrice = price * isItemExist.quantity;
      isItemExist.discount = discount;
      isItemExist.saved = saved;
    } else {
      // if the item does not exist add it to the cart
      cart.items.push({
        product: newItem.product,
        quantity: newItem.quantity,
        price,
        discount,
        saved,
        totalPrice: price * newItem.quantity,
      });
    }
    cartTotalSaved += saved;
  }

  // calculate the totals
  const updatedCart = calculateCartTotals(cart.items);

  // update the cart with the calculated totals
  Object.assign(cart, {
    items: updatedCart.items,
    totalAmount: updatedCart.totalAmount,
    tax: updatedCart.totalTax,
    discount: updatedCart.totalDiscount,
    totalSaved: cartTotalSaved,
    shippingCharge: updatedCart.shippingCharge,
    grandTotal: updatedCart.grandTotal,
  });

  return await cart.save();
};

export const cartServices = { addToCart };
