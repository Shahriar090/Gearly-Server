import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { productServices } from './productModel.services';
import httpStatus from 'http-status';

// create a product
const createProduct = asyncHandler(async (req, res) => {
  const { product } = req.body;
  const result = await productServices.createProductIntoDb(product);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product Created Successfully',
    data: result,
  });
});

// get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const result = await productServices.getAllProductsFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Products Are Retrieved Successfully',
    data: result,
  });
});

export const productControllers = {
  createProduct,
  getAllProducts,
};
