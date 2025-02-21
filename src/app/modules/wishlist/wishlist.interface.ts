import { Types } from 'mongoose';

export type TWishList = {
  user: Types.ObjectId;
  products: Types.ObjectId[];
};
