import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { Category } from '../category/category.model';
import { SUB_CATEGORIES_SEARCHABLE_FIELDS } from './subCategories.constants';
import { TSubCategory } from './subCategories.interface';
import { SubCategory } from './subCategories.model';
import httpStatus from 'http-status';

// create a sub category (brand) into the db
const createSubCategoryIntoDb = async (payload: TSubCategory) => {
  const categoryNameSlug = payload.categoryName
    .toLowerCase()
    .replace(/\s+/g, '-');

  // Find the category by slug
  const category = await Category.findOne({ slug: categoryNameSlug });

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Category Found.!',
      'NoCategoryFound',
    );
  }

  // ensuring sub category is unique per category, not globally

  const isExists = await SubCategory.findOne({
    name: payload.brandName,
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
    category: category._id,
  };
  const result = await SubCategory.create(subCategoryData);
  return result;
};

// get all sub categories
const getAllSubCategoriesFromDb = async (query: Record<string, unknown>) => {
  // const result = await SubCategory.find();
  // if (!result) {
  //   throw new AppError(
  //     httpStatus.NOT_FOUND,
  //     'Failed To Fetch Sub Categories.!',
  //     'SubCategoriesNotFound',
  //   );
  // }
  // return result;

  const subCategoryQuery = new QueryBuilder(SubCategory.find(), query)
    .search(SUB_CATEGORIES_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await subCategoryQuery.modelQuery;
  const meta = await subCategoryQuery.countTotal();

  if (!result.length) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Sub Category Found.!',
      'ProductsNotFound',
    );
  }

  return {
    meta,
    result,
  };
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

// update a sub category
const updateSubCategory = async (
  id: string,
  payload: Partial<TSubCategory>,
) => {
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Sub-Category Not Found',
      'SubCategoryNotFound',
    );
  }

  // update operation will be allowed only limited fields
  const allowedFieldsToUpdate: Array<keyof TSubCategory> = [
    'brandName',
    'description',
    'imageUrl',
  ];

  const updatedData: Record<string, unknown> = {};

  allowedFieldsToUpdate.forEach((field) => {
    if (payload[field] !== undefined) {
      updatedData[field] = payload[field];
    }
  });

  if (Object.keys(updatedData).length === 0) {
    return subCategory;
  }

  const updatedSubCategory = await SubCategory.findByIdAndUpdate(
    id,
    updatedData,
    { new: true, runValidators: true },
  );
  return updatedSubCategory;
};

// delete a sub category
const deleteSubcategoryFromDb = async (id: string) => {
  const subCategory = await SubCategory.findById(id);

  if (!subCategory) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Sub-Category Not Found.!',
      'SubCategoryNotFound',
    );
  }

  if (subCategory.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Sub-Category Already Deleted',
      'SubCategoryAlreadyDeleted',
    );
  }

  subCategory.isDeleted = true;
  await subCategory.save();

  return subCategory;
};
export const subCategoriesServices = {
  createSubCategoryIntoDb,
  getAllSubCategoriesFromDb,
  getSubCategoryFromDb,
  updateSubCategory,
  deleteSubcategoryFromDb,
};
