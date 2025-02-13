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

export const cartControllers = {
  addToCart,
};
