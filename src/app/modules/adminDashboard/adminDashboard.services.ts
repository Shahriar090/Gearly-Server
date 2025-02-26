// aggregation queries for dashboard states

import { Category } from '../category/category.model';
import { Order } from '../order/order.model';
import { Product } from '../productModel/productModel.model';
import { SubCategory } from '../subCategories/subCategories.model';
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

// get total products with status (available, out of stock)
const getProductsWithStatus = async () => {
  const totalProducts = await Product.countDocuments();
  const inStockProducts = await Product.countDocuments({
    stock: { $gt: 0 },
  });
  const outOfStockProducts = await Product.countDocuments({
    stock: 0,
  });

  return {
    totalProducts,
    inStockProducts,
    outOfStockProducts,
  };
};

// get total categories and brands
const getTotalCategoriesAndBrands = async () => {
  const totalCategories = await Category.countDocuments();
  const totalSubCategories = await SubCategory.countDocuments();

  return {
    totalCategories,
    totalBrands: totalSubCategories,
  };
};

// low stock products
const getLowStockProducts = async () => {
  const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
    .sort({ stock: 1 })
    .select('modelName brandName category subCategory stock')
    .populate('category', 'name')
    .populate('subCategory', 'brandName');

  return lowStockProducts;
};

export const adminDashboardServices = {
  getTotalSalesAndRevenue,
  getTotalOrders,
  getTotalUsersAndNewSignUp,
  getProductsWithStatus,
  getTotalCategoriesAndBrands,
  getLowStockProducts,
};
