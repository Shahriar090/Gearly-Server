import asyncHandler from '../../utils/asyncHandler';
import httpStatus from 'http-status';
import { orderServices } from './order.services';
import sendResponse from '../../utils/sendResponse';

const createOrder = asyncHandler(async (req, res) => {
  const { order } = req.body;
  const { id } = req.user;
  const result = await orderServices.createOrderIntoDb(order, id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Your Order Is Placed',
    data: result,
  });
});

export const orderControllers = {
  createOrder,
};
