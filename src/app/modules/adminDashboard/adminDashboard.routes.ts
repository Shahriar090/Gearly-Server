import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { adminDashboardControllers } from './adminDashboard.controllers';
const router = express.Router();

router
  .route('/total-sales-and-revenue')
  .get(
    auth(USER_ROLES.Admin),
    adminDashboardControllers.getTotalSalesAndRevenue,
  );

export const adminDashboardRoutes = router;
