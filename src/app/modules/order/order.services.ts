import AppError from '../../errors/appError';
import { TOrder, TOrderStatus } from './order.interface';
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

export const orderServices = {
  createOrderIntoDb,
  getOrderByIdFromDb,
  updateOrderStatusIntoDb,
};
