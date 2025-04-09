import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { flashSalesServices } from './flashSales.services';
import httpStatus from 'http-status';

const createFlashSales = asyncHandler(async (req, res) => {
  const result = await flashSalesServices.createFlashSales(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products Added To Flash Sales',
    data: result,
  });
});

// ----------------------
export const flashSalesControllers = {
  createFlashSales,
};
