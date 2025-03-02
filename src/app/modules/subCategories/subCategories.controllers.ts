import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { subCategoriesServices } from './subCategories.services';
import httpStatus from 'http-status';

// create a sub category
const createSubCategory = asyncHandler(async (req, res) => {
  const { subCategory } = req.body;
  const result =
    await subCategoriesServices.createSubCategoryIntoDb(subCategory);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Sub Category Created Successfully',
    data: result,
  });
});

// get all sub categories
const getAllSubCategories = asyncHandler(async (req, res) => {
  const result = await subCategoriesServices.getAllSubCategoriesFromDb(
    req.query,
  );

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

// update a subcategory
const updateSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await subCategoriesServices.updateSubCategory(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub-Category Is Updated Successfully',
    data: result,
  });
});

// delete a sub category
const deleteSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await subCategoriesServices.deleteSubcategoryFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub-Category Is Deleted Successfully',
    data: result,
  });
});

export const subCategoryControllers = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryFromDb,
  updateSubCategory,
  deleteSubCategory,
};
