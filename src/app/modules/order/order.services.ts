import AppError from '../../errors/appError';
import { TOrder } from './order.interface';
import httpStatus from 'http-status';
import { Order } from './order.model';
import { ORDER_STATUS, PAYMENT_STATUS } from './order.constants';
import { generateOrderTrackingId } from './order.utils';

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

export const orderServices = {
  createOrderIntoDb,
};
