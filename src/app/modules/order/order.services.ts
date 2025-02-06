import AppError from '../../errors/appError';
import { TOrder, TOrderStatus, TPaymentStatus } from './order.interface';
import httpStatus from 'http-status';
import { Order } from './order.model';
import { ORDER_STATUS, PAYMENT_STATUS } from './order.constants';
import { generateOrderTrackingId } from './order.utils';

// create order
const createOrderIntoDb = async (payload: TOrder, userId: string) => {
  if (!payload) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'All Fields Are Required',
      'RequiredFields',
    );
  }

  if (payload && payload.items.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Order Must Contain At Least One Item',
      'InvalidItem',
    );
  }

  const order = new Order({
    ...payload,
    user: userId,
    paymentStatus: PAYMENT_STATUS.Pending,
    status: ORDER_STATUS.Pending,
    trackingId: generateOrderTrackingId(),
  });

  await order.save();
  return order;
};

// get order by id
const getOrderByIdFromDb = async (orderId: string) => {
  const order = await Order.findById(orderId).populate('user items.product');

  if (!order || order.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Order Not Found',
      'OrderNotFound',
    );
  }

  return order;
};

// update order status (shipped, delivered, etc)
const updateOrderStatusIntoDb = async (
  orderId: string,
  status: TOrderStatus,
) => {
  if (!status || !Object.values(ORDER_STATUS).includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid Order Status',
      'InvalidOrderStatus',
    );
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: status },
    { new: true },
  );

  if (!updatedOrder) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Order Not Found',
      'OrderNotFound',
    );
  }

  return updatedOrder;
};

// cancel order from db (user can cancel their order if they want)
const cancelOrderFromDb = async (orderId: string, userId: string) => {
  const order = await Order.findById(orderId);

  if (!order || order.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Order Found', 'OrderNotFound');
  }

  // only the owner of the order or admin can cancel the order
  if (order.user.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You Are Not Authorized To Cancel This Order',
      'UnauthorizedCancelAction',
    );
  }
  if (order && order.orderStatus !== ORDER_STATUS.Pending) {
    // user can only cancel their order if the order status is pending

    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only Pending Orders Can Be Canceled',
      'InvalidCancel',
    );
  }

  order.orderStatus = ORDER_STATUS.Cancelled;
  await order.save();
  return order;
};

// update payment status (payment logic will be included soon)

const updatePaymentStatusIntoDb = async (
  orderId: string,
  paymentStatus: TPaymentStatus,
) => {
  if (
    !paymentStatus ||
    !Object.values(PAYMENT_STATUS).includes(paymentStatus)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid Payment Status',
      'InvalidPaymentStatus',
    );
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { paymentStatus: paymentStatus },
    { new: true },
  );

  if (!updatedOrder) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Order Not Found',
      'OrderNotFound',
    );
  }

  return updatedOrder;
};

// get all orders of a user
const getAllOrdersOfUser = async (userId: string) => {
  const orders = await Order.find({ user: userId }).populate('user');

  if (!orders || orders.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Order Found.!',
      'NoOrderFound',
    );
  }

  return orders;
};

// delete an order(soft delete)

const deleteOrderFromDb = async (orderId: string) => {
  const deletedOrder = await Order.findByIdAndUpdate(
    orderId,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedOrder) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Order Found.!',
      'NoOrderFound',
    );
  }

  return deletedOrder;
};

export const orderServices = {
  createOrderIntoDb,
  getOrderByIdFromDb,
  updateOrderStatusIntoDb,
  updatePaymentStatusIntoDb,
  getAllOrdersOfUser,
  deleteOrderFromDb,
  cancelOrderFromDb,
};
