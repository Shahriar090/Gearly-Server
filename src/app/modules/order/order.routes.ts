import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { orderValidations } from './order.validations';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { orderControllers } from './order.controllers';
const router = express.Router();

// create order
router
  .route('/create-order')
  .post(
    validateRequest(orderValidations.createOrderValidationSchema),
    auth(USER_ROLES.Customer),
    orderControllers.createOrder,
  );

// get order by id
router
  .route('/:orderId')
  .get(
    auth(USER_ROLES.Customer, USER_ROLES.Admin),
    orderControllers.getOrderById,
  );

// update order status (shipped, delivered)
router
  .route('/:orderId')
  .put(auth(USER_ROLES.Admin), orderControllers.updateOrderStatus);

// --------------
export const orderRoutes = router;
