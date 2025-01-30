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

// get single category
const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await categoryServices.getCategoryFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category Retrieved Successfully',
    data: result,
  });
});

// update a category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  const result = await categoryServices.updateCategoryIntoDb(id, category);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category Updated Successfully',
    data: result,
  });
});

// delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await categoryServices.deleteCategoryFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category Deleted Successfully',
    data: result,
  });
});

// restore deleted category (undo)
const restoreDeletedCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await categoryServices.restoreDeletedCategory(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category Restored Successfully',
    data: result,
  });
});
export const categoryControllers = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  restoreDeletedCategory,
};
