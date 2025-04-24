import { TCustomerInfo } from '../order/order.interface';
import { TProductModel } from '../productModel/productModel.interface';

export type TPayment = {
  trackingId: string;
  totalAmount: number;
  customerInfo: TCustomerInfo;
  products: {
    product: TProductModel;
    quantity: number;
    price: number;
    discount: number;
    saved: number;
    totalPrice: number;
  }[];

  deliveryMethod: string;
};
