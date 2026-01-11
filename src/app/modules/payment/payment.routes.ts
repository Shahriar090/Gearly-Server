import express from 'express';
import { paymentControllers } from './payment.controllers';
const router = express.Router();

router.route('/init').post(paymentControllers.initPayment);
// success
router.route('/payment-success/:tranId').post(paymentControllers.paymentSuccess);

//   failed
router.route('/payment-failed/:tranId').post(paymentControllers.paymentFailed);

// -----------------
export const paymentRoutes = router;
