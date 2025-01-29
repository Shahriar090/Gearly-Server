import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { categoryServices } from './category.services';
import httpStatus from 'http-status';

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

export const categoryControllers = {
  createCategory,
};
