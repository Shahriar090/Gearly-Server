/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/appError';
import { SubCategory } from '../subCategories/subCategories.model';
import { TProductModel } from './productModel.interface';
import httpStatus from 'http-status';
import { Product } from './productModel.model';
import slugify from 'slugify';
import { Review } from '../productReviews/productReviews.model';

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
  const products = await Product.find({ isDeleted: { $ne: true } })
    .populate('category')
    .populate('subCategory');

  if (!products || products.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Products Found.!',
      'ProductsNotFound',
    );
  }

  // fetch reviews for all products
  const productIds = products.map((product) => product._id);

  const reviews = await Review.find({ product: { $in: productIds } }).populate(
    'user',
  );
  // attach reviews and calculate average ratings for each product

  const productsWithReviews = products.map((product) => {
    const productReviews = reviews.filter((review) =>
      review.product.equals(product._id),
    );

    const totalRatings = productReviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );

    const averageRating = productReviews.length
      ? totalRatings / productReviews.length
      : 0;

    return { ...product.toObject(), reviews: productReviews, averageRating };
  });

  return productsWithReviews;
};

// get a single product
const getSingleProductFromDb = async (id: string) => {
  // check if the product is exists or not
  const product = await Product.findById(id)
    .populate('category')
    .populate('subCategory');

  if (!product || product.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Product Found.!',
      'ProductNotFound',
    );
  }

  // fetching all reviews of the product
  const reviews = await Review.find({ product: id }).populate('user');

  // calculate average rating
  const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length ? totalRatings / reviews.length : 0;

  return { ...product.toObject(), reviews, averageRating };
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

// delete a product
const deleteProductFromDb = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Product Found.!',
      'ProductNotFound',
    );
  }

  product.isDeleted = true;
  const result = await product.save();

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed To Delete The Product.!',
      'ProductDeleteFailed',
    );
  }

  return result;
};

export const productServices = {
  createProductIntoDb,
  getAllProductsFromDb,
  getSingleProductFromDb,
  updateProductIntoDb,
  deleteProductFromDb,
};
