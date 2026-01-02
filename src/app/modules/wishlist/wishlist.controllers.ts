import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { wishListServices } from './wishlist.services';
import httpStatus from 'http-status';

// add to wish list
const addToWishList = asyncHandler(async (req, res) => {
	const { id } = req.user;
	const { wishList } = req.body;
	const result = await wishListServices.addToWishList(id, wishList);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product Added To Wish List',
		data: result,
	});
});

// get wish list
const getWishList = asyncHandler(async (req, res) => {
	const { id } = req.user;
	const result = await wishListServices.getWishList(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Wish List Retrieved Successfully',
		data: result,
	});
});

// remove item from wish list
const removeItemFromWishList = asyncHandler(async (req, res) => {
	const { id } = req.user;
	const { productId } = req.params;
	const result = await wishListServices.deleteProductFromWishList(id, productId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Item Successfully Removed From The Wish List',
		data: result,
	});
});

export const wishListControllers = {
	addToWishList,
	getWishList,
	removeItemFromWishList,
};
