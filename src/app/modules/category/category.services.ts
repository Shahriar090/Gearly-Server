import AppError from '../../errors/appError';
import { TCategory } from './category.interface';
import { Category } from './category.model';
import httpStatus from 'http-status';

// create category
const createCategoryIntoDb = async (payload: TCategory) => {
  // check if the category already exists
  const isCategoryExists = await Category.findOne({ name: payload.name });
  if (isCategoryExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This Category Is Already Exist.!',
      'CategoryExistingError',
    );
  }
  const result = await Category.create(payload);
  return result;
};

// get all categories
const getAllCategoriesFromDb = async () => {
  const result = await Category.find();

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Category Found.!',
      'CategoryNotFound',
    );
  }

  return result;
};

// get single category
const getCategoryFromDb = async (id: string) => {
  const result = await Category.findById(id);

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Category Found.!',
      'CategoryNotFound',
    );
  }

  return result;
};

export const categoryServices = {
  createCategoryIntoDb,
  getAllCategoriesFromDb,
  getCategoryFromDb,
};
