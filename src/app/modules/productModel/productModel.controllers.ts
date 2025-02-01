import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { productServices } from './productModel.services';
import httpStatus from 'http-status';
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

export const productControllers = {
  createProduct,
};
