import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { reviewControllers } from './productReviews.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { reviewValidations } from './productReviews.validations';
const router = express.Router();

// create review
router
  .route('/create-review/:productId')
  .post(
    validateRequest(reviewValidations.createReviewValidationSchema),
    auth(USER_ROLES.Customer, USER_ROLES.Admin),
    reviewControllers.createReview,
  );

// update a review
router
  .route('/:reviewId')
  .put(
    auth(USER_ROLES.Admin, USER_ROLES.Customer),
    validateRequest(reviewValidations.updateReviewValidationSchema),
    reviewControllers.updateReview,
  );

// delete a review
router
  .route('/:reviewId')
  .delete(
    auth(USER_ROLES.Admin, USER_ROLES.Customer),
    reviewControllers.deleteReview,
  );

// fetch all reviews for a product
router.route('/:productId').get(reviewControllers.getAllReviewsForAProduct);

// fetch a single review
router.route('/:reviewId').get(reviewControllers.getSingleReview);
// -------------
export const reviewRoutes = router;
