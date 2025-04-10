import AppError from '../../errors/appError';
import { TFlashSales } from './flashSales.interface';
import { FlashSales } from './flashSales.model';
import moment from 'moment';
import httpStatus from 'http-status';

// add to flash sales
const createFlashSales = async (payload: {
  startTime: string;
  endTime: string;
  flashSales: TFlashSales[];
}) => {
  const { startTime, endTime, flashSales } = payload;

  const start = moment(startTime, 'DD/MM/YYYY').toDate();
  const end = moment(endTime, 'DD/MM/YYYY').toDate();

  const flashSalesArray = flashSales.map((sale) => ({
    ...sale,
    startTime: start,
    endTime: end,
  }));

  const newFlashSales = await FlashSales.insertMany(flashSalesArray);
  return newFlashSales;
};

// get all flash sales
const getFlashSales = async () => {
  // removing date filtering for temporary
  // const now = new Date();

  const flashSalesWithProducts = await FlashSales.aggregate([
    {
      $match: {
        isDeleted: { $ne: true },
        // startTime: { $lte: now },
        // endTime: { $gte: now },
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    {
      $unwind: '$product',
    },
    {
      $addFields: {
        flashSaleDiscountedPrice: {
          $subtract: [
            '$product.price',
            { $multiply: ['$product.price', { $divide: ['$discount', 100] }] },
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        productId: 1,
        discount: 1,
        startTime: 1,
        endTime: 1,
        flashSaleDiscountedPrice: 1,
        product: {
          _id: 1,
          modelName: 1,
          price: 1,
          images: 1,
          category: 1,
        },
      },
    },
  ]);

  return flashSalesWithProducts;
};

// delete a flash sale (soft delete)
const deleteFlashSale = async (id: string) => {
  const product = await FlashSales.findById(id);

  if (!product) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Product Found With This Id',
      'NotFound',
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

// -------------------------
export const flashSalesServices = {
  createFlashSales,
  getFlashSales,
  deleteFlashSale,
};
