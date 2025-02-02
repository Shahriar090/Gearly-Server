/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/appError';
import { SubCategory } from '../subCategories/subCategories.model';
import { TProductModel } from './productModel.interface';
import httpStatus from 'http-status';
import { Product } from './productModel.model';
import slugify from 'slugify';

// create a product
const createProductIntoDb = async (payload: TProductModel) => {
  // generating slug from category name to find the sub category using its slug
  const categorySlug = slugify(payload.subCategoryName, {
    lower: true,
    strict: true,
  });

  // find the sub category using the generated slug
  const subCategory = await SubCategory.findOne({
    slug: categorySlug,
  });
  if (!subCategory) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Sub Category Not Found.!',
      'SubCategoryNotFound',
    );
  }

  // find the parent category from the sub category
  const parentCategory = subCategory?.category;

  if (!parentCategory) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Parent Category Not Found.!',
      'ParentCategoryNotFound',
    );
  }

  // check if the product is already exists or not
  const isExists = await Product.findOne({ name: payload.name });

  if (isExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This Product Is Already Exists.!',
      'ProductExists',
    );
  }

  // create new product
  const newProduct = new Product({
    ...payload,
    subCategory: subCategory._id,
    category: parentCategory._id,
  });

  const result = await newProduct.save();
  return result;
};

// get all products
const getAllProductsFromDb = async () => {
  const result = await Product.find()
    .populate('category')
    .populate('subCategory');

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Products Found.!',
      'ProductsNotFound',
    );
  }

  return result;
};

// get a single product
const getSingleProductFromDb = async (id: string) => {
  // check if the product is exists or not
  const product = await Product.findById(id)
    .populate('category')
    .populate('subCategory');

  if (!product) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Product Found.!',
      'ProductNotFound',
    );
  }

  // check if the product is deleted
  if (product.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Product Is Deleted.!',
      'ProductNotFound',
    );
  }

  return product;
};

// update a product
const updateProductIntoDb = async (
  id: string,
  payload: Partial<TProductModel>,
) => {
  const { specifications, tags, images, ...remainingData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = { ...remainingData };

  if (!modifiedUpdatedData.$addToSet) {
    modifiedUpdatedData.$addToSet = {};
  }

  // specifications is and object which is holding an array of colors

  if (specifications && typeof specifications === 'object') {
    for (const [key, value] of Object.entries(specifications)) {
      // adding new color without replacing existing colors in the colors array.
      if (key === 'colors' && Array.isArray(value)) {
        (modifiedUpdatedData.$addToSet as Record<string, any>)[
          `specifications.colors`
        ] = { $each: value };
      } else {
        (modifiedUpdatedData as Record<string, any>)[`specifications.${key}`] =
          value;
      }
    }
  }

  // updating arrays
  const arrayUpdatesOperation: Record<string, { $each: string[] }> = {};

  if (tags && tags.length) {
    arrayUpdatesOperation.tags = { $each: tags };
  }

  if (images && images.length) {
    arrayUpdatesOperation.images = { $each: images };
  }

  if (Object.keys(arrayUpdatesOperation).length > 0) {
    const addToSet = modifiedUpdatedData.$addToSet as Record<string, any>;

    modifiedUpdatedData.$addToSet = {
      ...addToSet,
      ...arrayUpdatesOperation,
    };
  }

  const result = await Product.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Failed To Update The Product.!',
      'ProductUpdateFailed',
    );
  }

  return result;
};
export const productServices = {
  createProductIntoDb,
  getAllProductsFromDb,
  getSingleProductFromDb,
  updateProductIntoDb,
};
