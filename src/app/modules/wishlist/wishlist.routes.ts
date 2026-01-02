import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { wishlistValidations } from './wishlist.validations';
import { wishListControllers } from './wishlist.controllers';
const router = express.Router();

// add to wish list
router
	.route('/add-to-wishlist')
	.post(
		auth(USER_ROLES.Customer),
		validateRequest(wishlistValidations.createWishListValidationSchema),
		wishListControllers.addToWishList,
	);

// get wish list
router.route('/get-wish-list').get(auth(USER_ROLES.Customer), wishListControllers.getWishList);

// remove item
router.route('/remove-item/:productId').delete(auth(USER_ROLES.Customer), wishListControllers.removeItemFromWishList);
// -------------
export const wishListRoutes = router;
