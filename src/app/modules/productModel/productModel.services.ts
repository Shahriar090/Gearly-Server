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

export const productServices = {
  createProductIntoDb,
  getAllProductsFromDb,
};
