import AppError from '../../errors/appError';
import { Product } from '../productModel/productModel.model';
import { TProductReview } from './productReviews.interface';
import httpStatus from 'http-status';
import { Review } from './productReviews.model';
import { updateProductRatings } from './productReviews.utils';

// create a review
const createReview = async (
  userId: string,
  productId: string,
  payload: TProductReview,
) => {
  // check if the product is exists or not
  const product = await Product.findById(productId);

  if (!product || product.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Product Found',
      'NoProductFound',
    );
  }

  //   check if the user has already reviewed the product
  const isReviewed = await Review.findOne({ user: userId, product: productId });

  if (isReviewed) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You Have Already Reviewed This Product',
      'AlreadyReviewed',
    );
  }

  //   create a new review
  const newReview = await Review.create({
    user: userId,
    product: productId,
    rating: payload.rating,
    comment: payload.comment,
  });

  //   update the product's average rating
  await updateProductRatings(productId);
  return newReview;
};

export const reviewServices = {
  createReview,
};
