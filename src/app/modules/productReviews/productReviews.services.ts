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
  await Product.findByIdAndUpdate(
    productId,
    {
      $push: { reviews: newReview._id },
    },
    { new: true, useFindAndModify: false },
  );
  return newReview;
};

// update a review
const updateReview = async (
  reviewId: string,
  userId: string,
  payload: Partial<TProductReview>,
) => {
  // find the submitted review
  const submittedReview = await Review.findById(reviewId);

  if (!submittedReview) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Review Not Found.!',
      'ReviewNotFound',
    );
  }

  // check if the review is belong to the right user or not
  if (!submittedReview.user.equals(userId)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You Are Not Authorized To Update This Review',
      'NotAuthorized',
    );
  }

  // update the review
  if (payload.rating && payload.rating !== undefined) {
    submittedReview.rating = payload.rating;
  }

  if (payload.comment && payload.comment !== undefined) {
    submittedReview.comment = payload.comment;
  }

  await submittedReview.save();

  // updating product's average rating
  await updateProductRatings(submittedReview.product.toString());

  return submittedReview;
};

// delete a review
const deleteReview = async (reviewId: string, userId: string) => {
  const review = await Review.findById(reviewId);

  if (!review || review.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Review Not Found',
      'ReviewNotFound',
    );
  }

  if (!review.user.equals(userId)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You Are Not Authorized To Delete Tis Review',
      'NotAuthorized',
    );
  }

  review.isDeleted = true;
  await review.save();

  if (review.product) {
    await updateProductRatings(review.product.toString());
  }

  return review;
};

// get all reviews
const getAllReviewsForAProduct = async (productId: string) => {
  const product = await Product.findById(productId);

  if (!product || product.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Product Not Found',
      'ProductNotFound',
    );
  }

  // fetching all reviews for the product
  const reviews = await Review.find({ product: productId }).populate(
    'user',
    'name email',
  );

  return reviews;
};

// get single review for a product
const getSingleReview = async (reviewId: string) => {
  const review = await Review.findById(reviewId).populate('user', 'name email');

  if (!review) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Review Not Found.',
      'ReviewNotFound',
    );
  }
  return review;
};

export const reviewServices = {
  createReview,
  updateReview,
  deleteReview,
  getAllReviewsForAProduct,
  getSingleReview,
};
