import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { subCategoriesServices } from './subCategories.services';
import httpStatus from 'http-status';

// create a sub category
const createSubCategory = asyncHandler(async (req, res) => {
  const result = await subCategoriesServices.createSubCategoryIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Sub Category Created Successfully',
    data: result,
  });
});

// get all sub categories
const getAllSubCategories = asyncHandler(async (req, res) => {
  const result = await subCategoriesServices.getAllSubCategoriesFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Sub-Categories Are Retrieved Successfully',
    data: result,
  });
});

// get single sub category
const getSubCategoryFromDb = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await subCategoriesServices.getSubCategoryFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub-Category Is Retrieved Successfully',
    data: result,
  });
});

export const subCategoryControllers = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryFromDb,
};
