import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { cartServices } from './cart.services';
import httpStatus from 'http-status';

// add to cart
const addToCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { cart } = req.body;
  const result = await cartServices.addToCart(id, cart);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your Items Has Been Added To The Cart Successfully',
    data: result,
  });
});

// get user specific cart
const getCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const result = await cartServices.getCart(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart Retrieved Successfully',
    data: result,
  });
});

// update cart item
const updateCartItem = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { productId } = req.params;
  const { quantity } = req.body;

  const result = await cartServices.updateCartItem(id, productId, quantity);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your Cart Has Been Updated Successfully',
    data: result,
  });
});

// remove cart item
const removeCartItem = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { productId } = req.params;
  const result = await cartServices.removeCartItem(id, productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item Removed From The Cart Successfully',
    data: result,
  });
});

// clear cart
const clearCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const result = await cartServices.clearCart(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your Cart Has Been Cleared Successfully',
    data: result,
  });
});

export const cartControllers = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
