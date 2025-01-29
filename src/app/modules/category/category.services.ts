import AppError from '../../errors/appError';
import { TCategory } from './category.interface';
import { Category } from './category.model';
import httpStatus from 'http-status';

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

export const categoryServices = {
  createCategoryIntoDb,
};
