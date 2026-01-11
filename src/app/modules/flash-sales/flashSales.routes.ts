import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { flashSalesControllers } from './flashSales.controllers';
const router = express.Router();

router.route('/create-flash-sales').post(flashSalesControllers.createFlashSales);

// get all flash sales
router.route('/').get(auth(USER_ROLES.Customer, USER_ROLES.Admin), flashSalesControllers.getAllFlashSales);

// delete a flash sale item
router.route('/delete/:id').delete(flashSalesControllers.deleteFlashSale);
// ---------------------------
export const flashSalesRoutes = router;
