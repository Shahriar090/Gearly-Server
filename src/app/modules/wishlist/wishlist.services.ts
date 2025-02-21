import mongoose from 'mongoose';
import WishList from './wishlist.model';
import { Product } from '../productModel/productModel.model';
import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { TWishList } from './wishlist.interface';

// add to wishlist
const addToWishList = async (userId: string, payload: TWishList) => {
  if (!payload || !payload.products) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid Request Data',
      'InvalidRequest',
    );
  }

  const productObjId = new mongoose.Types.ObjectId(payload.products[0]);

  // check if the product is exist
  const isProductExists = await Product.findOne({ _id: productObjId });

  if (!isProductExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Product Not Found',
      'ProductNotFound',
    );
  }

  // find the user's wishlist
  let wishList = await WishList.findOne({ user: userId });

  if (!wishList) {
    wishList = new WishList({ user: userId, products: [productObjId] });
  } else if (!wishList.products.includes(productObjId)) {
    wishList.products.push(productObjId);
  }

  return await wishList.save();
};

// get wish list
const getWishList = async (userId: string) => {
  const wishList = await WishList.findOne({ user: userId }).populate(
    'products',
  );

  if (!wishList) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Wish List Not Found',
      'WishListNotFound',
    );
  }

  return wishList;
};

// -----------------------
export const wishListServices = {
  addToWishList,
  getWishList,
};
