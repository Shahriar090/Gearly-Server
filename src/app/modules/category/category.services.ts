import AppError from '../../errors/appError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { TCategory } from './category.interface';
import { Category } from './category.model';
import httpStatus from 'http-status';

// create category
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createCategoryIntoDb = async (payload: TCategory, file: any) => {
  // check if the category already exists
  const isCategoryExists = await Category.findOne({ name: payload.name });
  if (isCategoryExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This Category Is Already Exist.!',
      'CategoryExistingError',
    );
  }

  if (file) {
    const imageName = `${payload.name}`;
    const imagePath = file.path;

    // send image to cloudinary
    const categoryImage = await sendImageToCloudinary(imageName, imagePath);
    const { secure_url } = categoryImage;
    payload.imageUrl = secure_url as string;
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

// update a category
const updateCategoryIntoDb = async (id: string, payload: TCategory) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Category Found.!',
      'CategoryNotFound',
    );
  }

  // check if the new name conflicts with any other category
  if (payload.name) {
    const existingCategory = await Category.findOne({
      name: payload.name,
    }).exec();

    if (existingCategory && existingCategory._id.toString() !== id) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Category Name Already Exists.!',
        'CategoryNameConflict',
      );
    }
  }

  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed To Update Category',
      'CategoryUpdateFailed',
    );
  }

  return result;
};

// delete a category (soft delete)
const deleteCategoryFromDb = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Category Found.!',
      'CategoryNotFound',
    );
  }

  category.isDeleted = true;
  await category.save(); //(for validation and timestamp update)

  return category;
};

// restore deleted category (undo)
const restoreDeletedCategory = async (id: string) => {
  const category = await Category.findOne({ _id: id, isDeleted: true });

  // check if the category is found or not
  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Category Found.!',
      'CategoryNotFound',
    );
  }

  category.isDeleted = false;
  await category.save();

  return category;
};

export const categoryServices = {
  createCategoryIntoDb,
  getAllCategoriesFromDb,
  getCategoryFromDb,
  updateCategoryIntoDb,
  deleteCategoryFromDb,
  restoreDeletedCategory,
};
