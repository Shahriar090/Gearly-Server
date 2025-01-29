import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { categoryServices } from './category.services';
import httpStatus from 'http-status';

// create category
const createCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;
  const result = await categoryServices.createCategoryIntoDb(category);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category Created Successfully',
    data: result,
  });
});

// get all categories
const getAllCategories = asyncHandler(async (req, res) => {
  const result = await categoryServices.getAllCategoriesFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Categories Are Retrieved Successfully',
    data: result,
  });
});

export const categoryControllers = {
  createCategory,
  getAllCategories,
};
