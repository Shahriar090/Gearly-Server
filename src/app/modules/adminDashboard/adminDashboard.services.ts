// aggregation queries for dashboard states

import { Order } from '../order/order.model';
import { User } from '../user/user.model';

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

// get total users and new sign ups
const getTotalUsersAndNewSignUp = async () => {
  const totalUsers = await User.countDocuments({ role: 'Customer' });

  const newUsers = await User.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 1000) },
  });

  return {
    totalUsers,
    newUsers,
  };
};

export const adminDashboardServices = {
  getTotalSalesAndRevenue,
  getTotalOrders,
  getTotalUsersAndNewSignUp,
};
