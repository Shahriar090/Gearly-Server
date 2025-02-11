import asyncHandler from '../../utils/asyncHandler';
import httpStatus from 'http-status';
import { orderServices } from './order.services';
import sendResponse from '../../utils/sendResponse';

// create order
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

// get order by id
const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const result = await orderServices.getOrderByIdFromDb(orderId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Your Order Is Retrieved Successfully',
    data: result,
  });
});

// update order status (delivered, shipped, etc)

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body.order;

  const result = await orderServices.updateOrderStatusIntoDb(
    orderId,
    orderStatus,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order Status Is Updated Successfully',
    data: result,
  });
});

// cancel order
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { id } = req.user; // User id
  const result = await orderServices.cancelOrderFromDb(orderId, id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Your Order Has Been Cancelled Successfully',
    data: result,
  });
});

// update payment status
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus } = req.body.order;

  const result = await orderServices.updatePaymentStatusIntoDb(
    orderId,
    paymentStatus,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Payment Status Is Updated Successfully',
    data: result,
  });
});

// get all orders of a user
const getAllOrdersOfUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const result = await orderServices.getAllOrdersOfUser(userId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'All Of Your Orders Are Retrieved Successfully',
    data: result,
  });
});

// delete an order
const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const result = await orderServices.deleteOrderFromDb(orderId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order Was Deleted Successfully',
    data: result,
  });
});

// count total orders
const countTotalOrders = asyncHandler(async (req, res) => {
  const result = await orderServices.countTotalOrdersFromDb();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Total Orders Are Retrieved Successfully',
    data: result,
  });
});

// count total sales
const countTotalSales = asyncHandler(async (req, res) => {
  const result = await orderServices.calculateTotalSalesFromDb();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Total Sales Are Retrieved Successfully',
    data: result,
  });
});

// calculate total sales by date
const calculateTotalSalesByDate = asyncHandler(async (req, res) => {
  const result = await orderServices.calculateTotalSalesByDate();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Total Sales By Date Retrieved Successfully',
    data: result,
  });
});
export const orderControllers = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getAllOrdersOfUser,
  deleteOrder,
  cancelOrder,
  countTotalOrders,
  countTotalSales,
  calculateTotalSalesByDate,
};
