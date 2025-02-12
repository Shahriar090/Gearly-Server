import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { cartControllers } from './cart.controllers';
const router = express.Router();

router
  .route('/create-cart')
  .post(auth(USER_ROLES.Customer), cartControllers.createCart);

// ----------------
export const cartRoutes = router;
