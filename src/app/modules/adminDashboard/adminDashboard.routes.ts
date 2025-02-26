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

// get total categories and brands (sub categories)
router
  .route('/total-categories-and-brands')
  .get(
    auth(USER_ROLES.Admin),
    adminDashboardControllers.getTotalCategoriesAndBrands,
  );

// get lowest stock products
router
  .route('/lowest-stock-products')
  .get(auth(USER_ROLES.Admin), adminDashboardControllers.getLowStockProducts);
// ------------------------------------
export const adminDashboardRoutes = router;
