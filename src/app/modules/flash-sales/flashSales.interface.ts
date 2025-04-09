import { Types } from 'mongoose';

export type TFlashSales = {
  productId: Types.ObjectId;
  discount: number;
  startTime: Date;
  endTime: Date;
};
