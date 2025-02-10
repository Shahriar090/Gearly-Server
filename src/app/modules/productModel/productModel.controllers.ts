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
  const result = await productServices.getAllProductsFromDb(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Products Are Retrieved Successfully',
    data: result,
  });
});

// get a single product
const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await productServices.getSingleProductFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Is Retrieved Successfully',
    data: result,
  });
});

// update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { product } = req.body;
  const result = await productServices.updateProductIntoDb(id, product);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Is Updated Successfully',
    data: result,
  });
});

// delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await productServices.deleteProductFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Is Deleted Successfully',
    data: result,
  });
});

export const productControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
