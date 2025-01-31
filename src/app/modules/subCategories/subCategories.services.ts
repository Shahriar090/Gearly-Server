import AppError from '../../errors/appError';
import { Category } from '../category/category.model';
import { TSubCategory } from './subCategories.interface';
import { SubCategory } from './subCategories.model';
import httpStatus from 'http-status';

// create a sub category
const createSubCategoryIntoDb = async (payload: TSubCategory) => {
  const category = await Category.findOne({ name: payload.categoryName });
  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Category Found.!',
      'NoCategoryFound',
    );
  }

  // ensuring sub category is unique per category, not globally

  const isExists = await SubCategory.findOne({
    name: payload.name,
    category: category._id,
  });

  if (isExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This Sub-Category Already Exists under this Category.!',
      'SubCategoryExists',
    );
  }

  const subCategoryData = {
    ...payload,
    category: category?._id,
  };
  const result = await SubCategory.create(subCategoryData);
  return result;
};

// get all sub categories
const getAllSubCategoriesFromDb = async () => {
  const result = await SubCategory.find();

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Failed To Fetch Sub Categories.!',
      'SubCategoriesNotFound',
    );
  }
  return result;
};

// get a single sub category
const getSubCategoryFromDb = async (id: string) => {
  const result = await SubCategory.findById(id);

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Sub Category Found.!',
      'SubCategoryNotFound',
    );
  }
  return result;
};

export const subCategoriesServices = {
  createSubCategoryIntoDb,
  getAllSubCategoriesFromDb,
  getSubCategoryFromDb,
};
