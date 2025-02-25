import AppError from '../../errors/appError';
import { TOrder, TOrderStatus, TPaymentStatus } from './order.interface';
import httpStatus from 'http-status';
import { Order } from './order.model';
import { ORDER_STATUS, PAYMENT_STATUS } from './order.constants';
import { calculateOrder, generateOrderTrackingId } from './order.utils';
import { Product } from '../productModel/productModel.model';
import mongoose from 'mongoose';

// create order
const createOrderIntoDb = async (payload: TOrder, userId: string) => {
  if (!payload || payload.items.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Order Items Found',
      'NoOrderItems',
    );
  }

  // start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const products = await Product.find({
      _id: { $in: payload.items.map((item) => item.product) },
    }).session(session); // attached the transaction session

    if (products.length !== payload.items.length) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'One Or More Products Were Not Found',
        'ProductNotFound',
      );
    }

    const orderItems = [];
    for (const item of payload.items) {
      const product = products.find(
        (p) => p._id.toString() === item.product.toString(),
      );

      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Product With ID ${item.product} Not Found`,
          'ProductNotFound',
        );
      }

      // check stock availability
      if (product.stock < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient Stock For Product ${product.modelName}. Available: ${product.stock}, Ordered:${item.quantity}`,
          'InsufficientStock',
        );
      }

      // decreasing stock dynamically
      product.stock -= item.quantity;
      await product.save({ session });

      const price = product.discountPrice ?? product.price;
      const discount = product.price - price;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: price,
        discount: discount,
        saved: product.saved ?? 0,
        totalPrice: 0,
      });
    }

    // calculate tax, shipping price etc.
    const {
      items: calculatedItems,
      totalAmount,
      tax,
      discount,
      totalSaved,
      shippingCharge,
      grandTotal,
    } = calculateOrder(orderItems);

    const trackingId = generateOrderTrackingId();

    const order = new Order({
      user: userId,
      trackingId,
      items: calculatedItems,
      totalAmount,
      tax,
      totalSaved,
      shippingCharge,
      discount,
      grandTotal,
      orderStatus: ORDER_STATUS.Pending,
      paymentStatus: PAYMENT_STATUS.Pending,
      paymentMethod: payload.paymentMethod,
      address: payload.address,
    });

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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

// count total orders
const countTotalOrdersFromDb = async () => {
  const totalOrders = await Order.countDocuments({ isDeleted: false });

  if (totalOrders === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Orders Found',
      'NoOrdersFound',
    );
  }

  return totalOrders;
};

// calculate total sales
const calculateTotalSalesFromDb = async () => {
  const orders = await Order.find();
  if (orders.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Order Found', 'NoOrderFound');
  }
  const totalSales = orders.reduce((sum, order) => {
    if (order.totalAmount && typeof order.totalAmount === 'number') {
      return sum + order.totalAmount;
    }
    return sum;
  }, 0);

  return totalSales;
};

// calculate sales by date
const calculateTotalSalesByDate = async () => {
  const sales = await Order.aggregate([
    {
      $match: { isDeleted: false },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalSales: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return sales;
};

// calculate sales between dates
const calculateSalesBetweenDates = async (
  startDate: string,
  endDate: string,
) => {
  const sales = await Order.aggregate([
    {
      $match: {
        isDeleted: false,
        createdAt: {
          $gte: new Date(`${startDate}T00:00:00.000Z`),
          $lt: new Date(`${endDate}T23:59:59.999Z`),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalSales: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return sales;
};

export const orderServices = {
  createOrderIntoDb,
  getOrderByIdFromDb,
  updateOrderStatusIntoDb,
  updatePaymentStatusIntoDb,
  getAllOrdersOfUser,
  deleteOrderFromDb,
  cancelOrderFromDb,
  countTotalOrdersFromDb,
  calculateTotalSalesFromDb,
  calculateTotalSalesByDate,
  calculateSalesBetweenDates,
};
