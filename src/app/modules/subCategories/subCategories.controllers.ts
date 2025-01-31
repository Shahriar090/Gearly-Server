import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { subCategoriesServices } from './subCategories.services';
import httpStatus from 'http-status';
const createSubCategory = asyncHandler(async (req, res) => {
  const result = await subCategoriesServices.createSubCategoryIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Sub Category Created Successfully',
    data: result,
  });
});

export const subCategoryControllers = {
  createSubCategory,
};
