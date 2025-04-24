import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config';
import { Product } from '../productModel/productModel.model';
import { Order } from '../order/order.model';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { TPayment } from './payment.interface';
import { isPopulatedCategory } from './payment.utils';

const store_id = config.ssl_store_id;
const store_passwd = config.ssl_store_password;
const is_live = false; // true for live, false for sandbox

const initSslCommerzPayment = async (payload: TPayment) => {
  const cartItems = payload.products;
  let productName = '';

  if (cartItems.length === 1) {
    productName = cartItems[0].product.modelName;
  } else if (cartItems.length === 2) {
    productName = `${cartItems[0].product.modelName} & ${cartItems[1].product.modelName}`;
  } else if (cartItems.length > 2) {
    productName = `${cartItems[0].product.modelName} & ${cartItems.length - 1} other items`;
  }

  // getting product ids

  const productIds = cartItems.map((item) => item.product);

  const products = await Product.find({ _id: { $in: productIds } }).populate(
    'category',
  );
  const categoryNames = [
    ...new Set(
      products
        .map((p) => {
          if (isPopulatedCategory(p.category)) {
            return p.category.name;
          }
          return null;
        })
        .filter(Boolean),
    ),
  ];

  let productCategory: string = '';

  if (categoryNames.length === 1) {
    productCategory = categoryNames[0] as string;
  } else if (categoryNames.length === 2) {
    productCategory = `${categoryNames[0]} & ${categoryNames[1]}`;
  } else if (categoryNames.length > 2) {
    productCategory = `${categoryNames[0]} & ${categoryNames.length - 1} other categories`;
  }
  const data = {
    total_amount: payload.totalAmount,
    currency: 'BDT',
    tran_id: payload.trackingId, // use unique tran_id for each api call
    success_url: `${config.back_end_deployed_url}/payment/payment-success/${payload.trackingId}`,
    fail_url: `${config.back_end_deployed_url}/payment/payment-failed/${payload.trackingId}`,
    cancel_url: 'http://localhost:3030/cancel',
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: payload.deliveryMethod,
    product_name: productName,
    product_category: productCategory || '',
    product_profile: 'general',
    cus_name: `${payload.customerInfo.firstName} ${payload.customerInfo.lastName}`,
    cus_email: payload.customerInfo.email,
    cus_add1: payload.customerInfo.address,
    cus_add2: 'Dhaka',
    cus_city: payload.customerInfo.city,
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: payload.customerInfo.mobile,
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const apiResponse = await sslcz.init(data);
  return apiResponse.GatewayPageURL;
};

// payment success
const paymentSuccess = async (tranId: string) => {
  const order = await Order.findOne({ trackingId: tranId });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Order Found');
  }

  if (order.paymentStatus === 'Paid') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Payment Already Marked As Paid For Order: ${tranId}`,
    );
  }

  order.paymentStatus = 'Paid';
  return await order.save();
};

// payment failed
const paymentFailed = async (tranId: string) => {
  const order = await Order.findOne({ trackingId: tranId });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Order Found');
  }

  if (order.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Order Already Marked As Deleted',
    );
  }

  order.paymentStatus = 'Pending';
  order.isDeleted = true;
  return await order.save();
};

export const sslPaymentServices = {
  initSslCommerzPayment,
  paymentSuccess,
  paymentFailed,
};
