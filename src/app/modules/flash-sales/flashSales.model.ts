import { model, Schema } from 'mongoose';
import { TFlashSales } from './flashSales.interface';

const flashSalesSchema = new Schema<TFlashSales>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

// model
export const FlashSales = model<TFlashSales>('flashSales', flashSalesSchema);
