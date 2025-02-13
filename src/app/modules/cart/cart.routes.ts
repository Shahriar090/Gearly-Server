import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { cartControllers } from './cart.controllers';
const router = express.Router();

// add to cart
router
  .route('/add-to-cart')
  .post(auth(USER_ROLES.Customer), cartControllers.addToCart);
// ----------------
export const cartRoutes = router;
