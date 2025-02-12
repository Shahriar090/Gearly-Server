import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { cartServices } from './cart.services';
import httpStatus from 'http-status';

// create a new cart for the first time
const createCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const result = await cartServices.createCart(id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Your Cart Has Been Created',
    data: result,
  });
});

export const cartControllers = {
  createCart,
};
