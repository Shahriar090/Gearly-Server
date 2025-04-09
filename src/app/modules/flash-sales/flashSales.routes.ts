import express from 'express';
import { flashSalesControllers } from './flashSales.controllers';
const router = express.Router();

router
  .route('/create-flash-sales')
  .post(flashSalesControllers.createFlashSales);
// ---------------------------
export const flashSalesRoutes = router;
