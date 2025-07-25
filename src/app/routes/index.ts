import express from 'express';
import { adminDashboardRoutes } from '../modules/adminDashboard/adminDashboard.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { cartRoutes } from '../modules/cart/cart.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { flashSalesRoutes } from '../modules/flash-sales/flashSales.routes';
import { oAuthRoutes } from '../modules/o_auth/o_auth.routes';
import { orderRoutes } from '../modules/order/order.routes';
import { paymentRoutes } from '../modules/payment/payment.routes';
import { productRoutes } from '../modules/productModel/productModel.routes';
import { reviewRoutes } from '../modules/productReviews/productReviews.routes';
import { subCategoryRoutes } from '../modules/subCategories/subCategories.routes';
import { userRoutes } from '../modules/user/user.routes';
import { wishListRoutes } from '../modules/wishlist/wishlist.routes';
const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/sub-categories',
    route: subCategoryRoutes,
  },
  {
    path: '/products',
    route: productRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
  {
    path: '/orders',
    route: orderRoutes,
  },
  {
    path: '/cart',
    route: cartRoutes,
  },
  {
    path: '/wish-list',
    route: wishListRoutes,
  },
  {
    path: '/admin-dashboard',
    route: adminDashboardRoutes,
  },
  {
    path: '/flash-sales',
    route: flashSalesRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
  {
    path: '/o-auth',
    route: oAuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
