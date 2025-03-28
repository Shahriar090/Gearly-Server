import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { adminDashboardServices } from './adminDashboard.services';
import httpStatus from 'http-status';

const getTotalSalesAndRevenue = asyncHandler(async (req, res) => {
  const result = await adminDashboardServices.getTotalSalesAndRevenue();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Total Sales And Revenue',
    data: result,
  });
});

// get total orders
const getTotalOrders = asyncHandler(async (req, res) => {
  const result = await adminDashboardServices.getTotalOrders();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Total Orders List',
    data: result,
  });
});

// get total users and new sign ups
const getTotalUsersAndNewSignUp = asyncHandler(async (req, res) => {
  const result = await adminDashboardServices.getTotalUsersAndNewSignUp();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Total Users And New Sign Up Data.',
    data: result,
  });
});

// get products with status (available, out of stock)
const getProductsWithStatus = asyncHandler(async (req, res) => {
  const result = await adminDashboardServices.getProductsWithStatus();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Products With Their Availability Status',
    data: result,
  });
});

// get total categories and brands
const getTotalCategoriesAndBrands = asyncHandler(async (req, res) => {
  const result = await adminDashboardServices.getTotalCategoriesAndBrands();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Available Categories And Sub Categories',
    data: result,
  });
});

// get low stock products
const getLowStockProducts = asyncHandler(async (req, res) => {
  const result = await adminDashboardServices.getLowStockProducts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Products With Lowest Stock Available',
    data: result,
  });
});

// get best selling products
const getBestSellingProducts = asyncHandler(async (req, res) => {
  const result = await adminDashboardServices.getBestSellingProducts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Time Best Selling Products',
    data: result,
  });
});

// get top performing categories
const getTopPerformingCategories = asyncHandler(async (req, res) => {
  const result = await adminDashboardServices.getTopPerformingCategories();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Top Performing Categories',
    data: result,
  });
});

// -----------------------------------------
export const adminDashboardControllers = {
  getTotalSalesAndRevenue,
  getTotalOrders,
  getTotalUsersAndNewSignUp,
  getProductsWithStatus,
  getTotalCategoriesAndBrands,
  getLowStockProducts,
  getBestSellingProducts,
  getTopPerformingCategories,
};
