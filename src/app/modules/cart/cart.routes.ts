import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { cartControllers } from './cart.controllers';
const router = express.Router();

// add to cart
router
  .route('/add-to-cart')
  .post(auth(USER_ROLES.Customer), cartControllers.addToCart);

// get user specific cart
router
  .route('/get-cart/:userId')
  .get(auth(USER_ROLES.Customer), cartControllers.getCart);

// update cart item
router
  .route('/update-item/:productId')
  .patch(auth(USER_ROLES.Customer), cartControllers.updateCartItem);
// ----------------
export const cartRoutes = router;
