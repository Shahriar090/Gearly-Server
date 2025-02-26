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
export const adminDashboardControllers = {
  getTotalSalesAndRevenue,
  getTotalOrders,
  getTotalUsersAndNewSignUp,
};
