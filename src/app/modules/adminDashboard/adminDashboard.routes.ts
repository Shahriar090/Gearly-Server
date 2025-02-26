import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { adminDashboardControllers } from './adminDashboard.controllers';
const router = express.Router();

// total sales and revenue
router
  .route('/total-sales-and-revenue')
  .get(
    auth(USER_ROLES.Admin),
    adminDashboardControllers.getTotalSalesAndRevenue,
  );

//   get total orders
router
  .route('/total-orders')
  .get(auth(USER_ROLES.Admin), adminDashboardControllers.getTotalOrders);

//   total users and new sign up
router
  .route('/total-users-and-new-sign-up')
  .get(
    auth(USER_ROLES.Admin),
    adminDashboardControllers.getTotalUsersAndNewSignUp,
  );

// products with their availability status
router
  .route('/products-availability-status')
  .get(auth(USER_ROLES.Admin), adminDashboardControllers.getProductsWithStatus);
export const adminDashboardRoutes = router;
