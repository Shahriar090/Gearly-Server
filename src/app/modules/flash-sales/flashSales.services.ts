import { TFlashSales } from './flashSales.interface';
import { FlashSales } from './flashSales.model';
import moment from 'moment';

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

// -------------------------
export const flashSalesServices = {
  createFlashSales,
};
