import AppError from '../../errors/appError';
import asyncHandler from '../../utils/asyncHandler';
import { handleImageUpload } from '../../utils/sendImageToCloudinary';
import sendResponse from '../../utils/sendResponse';
import { subCategoriesServices } from './subCategories.services';
import httpStatus from 'http-status';

// create a sub category
const createSubCategory = asyncHandler(async (req, res) => {
  const { subCategory } = req.body;

  // file uploading
  const uploadImage = await handleImageUpload(req);

  if (!uploadImage) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Image upload failed.',
      'ImageUploadError',
    );
  }
  subCategory.imageUrl = uploadImage;

  const result =
    await subCategoriesServices.createSubCategoryIntoDb(subCategory);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Sub Category Created Successfully',
    data: result,
  });
});

// get all sub categories with product count
const getAllSubCategoriesWithProductCount = asyncHandler(async (req, res) => {
  const result =
    await subCategoriesServices.getAllSubCategoriesWithProductCount(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Sub-Categories Are Retrieved With Product Count Successfully',
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

// get sub category by category
const getSubCategoryByCategory = asyncHandler(async (req, res) => {
  const { category: slug } = req.query;
  const result = await subCategoriesServices.getSubCategoryByCategory(
    slug as string,
  );

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
  getAllSubCategoriesWithProductCount,
  getSubCategoryByCategory,
  getSubCategoryFromDb,
  updateSubCategory,
  deleteSubCategory,
};
