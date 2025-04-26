import config from '../../config';
import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { sslPaymentServices } from './payment.services';
import httpStatus from 'http-status';

const initPayment = asyncHandler(async (req, res) => {
  const gatewayUrl = await sslPaymentServices.initSslCommerzPayment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Session Initiated Successfully',
    data: { gatewayUrl },
  });
});

// payment success
const paymentSuccess = asyncHandler(async (req, res) => {
  const { tranId } = req.params;
  await sslPaymentServices.paymentSuccess(tranId);
  res.redirect(`${config.front_end_local_url}/users/payment-success/${tranId}`);
});

// payment failed
const paymentFailed = asyncHandler(async (req, res) => {
  const { tranId } = req.params;
  await sslPaymentServices.paymentFailed(tranId);
  res.redirect(
    `${config.front_end_deployed_url}/users/payment-failed/${tranId}`,
  );
});

// ------------------
export const paymentControllers = {
  initPayment,
  paymentSuccess,
  paymentFailed,
};
