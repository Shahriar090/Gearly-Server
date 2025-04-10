import express from 'express';
import { flashSalesControllers } from './flashSales.controllers';
const router = express.Router();

router
  .route('/create-flash-sales')
  .post(flashSalesControllers.createFlashSales);

// get all flash sales
router.route('/').get(flashSalesControllers.getAllFlashSales);

// delete a flash sale item
router.route('/delete/:id').delete(flashSalesControllers.deleteFlashSale);
// ---------------------------
export const flashSalesRoutes = router;
