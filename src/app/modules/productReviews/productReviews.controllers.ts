import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { reviewServices } from './productReviews.services';
import httpStatus from 'http-status';

// create a review
const createReview = asyncHandler(async (req, res) => {
	const { id } = req.user;
	const { productId } = req.params;
	const { review } = req.body;

	const result = await reviewServices.createReview(id, productId, review);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Your Review Has Added Successfully',
		data: result,
	});
});

// update a review
const updateReview = asyncHandler(async (req, res) => {
	const { reviewId } = req.params;
	const { id } = req.user;
	const { review } = req.body;

	const result = await reviewServices.updateReview(reviewId, id, review);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Your Review Has Updated Successfully',
		data: result,
	});
});

// delete a review
const deleteReview = asyncHandler(async (req, res) => {
	const { reviewId } = req.params;
	const { id } = req.user;

	const result = await reviewServices.deleteReview(reviewId, id);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Your Review Is Deleted Successfully',
		data: result,
	});
});

// get all reviews for a product
const getAllReviewsForAProduct = asyncHandler(async (req, res) => {
	const { productId } = req.params;

	const result = await reviewServices.getAllReviewsForAProduct(productId);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'All Reviews For This Product Fetched Successfully',
		data: result,
	});
});

// get single review
const getSingleReview = asyncHandler(async (req, res) => {
	const { reviewId } = req.params;
	const result = await reviewServices.getSingleReview(reviewId);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Review Is Fetched Successfully',
		data: result,
	});
});

export const reviewControllers = {
	createReview,
	updateReview,
	deleteReview,
	getAllReviewsForAProduct,
	getSingleReview,
};
