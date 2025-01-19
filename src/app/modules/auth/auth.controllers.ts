import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.services';
import httpStatus from 'http-status';

const loginUser = asyncHandler(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  const { accessToken } = result;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Login Successful.',
    data: { accessToken },
  });
});

export const authControllers = {
  loginUser,
};
