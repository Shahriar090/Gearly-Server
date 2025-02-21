import { Types } from 'mongoose';

export type TWishList = {
  userId: Types.ObjectId;
  productId: Types.ObjectId[];
};
