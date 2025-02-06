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

// get all orders of a user
router
  .route('/:userId')
  .get(
    auth(USER_ROLES.Admin, USER_ROLES.Customer),
    orderControllers.getAllOrdersOfUser,
  );

// get order by id
router
  .route('/:orderId')
  .get(
    auth(USER_ROLES.Customer, USER_ROLES.Admin),
    orderControllers.getOrderById,
  );

// cancel order
router
  .route('/cancel-order/:orderId')
  .patch(
    auth(USER_ROLES.Admin, USER_ROLES.Customer),
    orderControllers.cancelOrder,
  );

// delete order by id
router
  .route('/:orderId')
  .delete(auth(USER_ROLES.Admin), orderControllers.deleteOrder);

// update order status (shipped, delivered)
router
  .route('/order-status/:orderId')
  .put(auth(USER_ROLES.Admin), orderControllers.updateOrderStatus);

// update payment status
router
  .route('/payment-status/:orderId')
  .put(auth(USER_ROLES.Admin), orderControllers.updatePaymentStatus);

// --------------
export const orderRoutes = router;
