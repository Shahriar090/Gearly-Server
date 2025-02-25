// aggregation queries for dashboard states

import { Order } from '../order/order.model';

// get total sales and revenue

const getTotalSalesAndRevenue = async () => {
  const totalSales = await Order.aggregate([
    {
      $match: { orderStatus: 'Shipped' },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$grandTotal' },
        totalSales: { $sum: 1 },
      },
    },
  ]);

  return totalSales;
};

// get total orders grouped by order status
const getTotalOrders = async () => {
  const orderStats = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 },
      },
    },
  ]);
  return orderStats;
};

export const adminDashboardServices = {
  getTotalSalesAndRevenue,
  getTotalOrders,
};
