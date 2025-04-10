import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { flashSalesServices } from './flashSales.services';
import httpStatus from 'http-status';

// add to flash sales
const createFlashSales = asyncHandler(async (req, res) => {
  const result = await flashSalesServices.createFlashSales(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products Added To Flash Sales',
    data: result,
  });
});

// get all flash sales
const getAllFlashSales = asyncHandler(async (req, res) => {
  const result = await flashSalesServices.getFlashSales();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Flash Sales Products Are Retrieved Successfully',
    data: result,
  });
});

// delete a flash sale item
const deleteFlashSale = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await flashSalesServices.deleteFlashSale(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Removed From Flash Sales',
    data: result,
  });
});

// ----------------------
export const flashSalesControllers = {
  createFlashSales,
  getAllFlashSales,
  deleteFlashSale,
};
