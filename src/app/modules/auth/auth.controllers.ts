import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.services';
import httpStatus from 'http-status';

const loginUser = asyncHandler(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  const { accessToken, refreshToken, user } = result;

  // HTTP only cookie for refresh token
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Login Successful.',
    data: {
      tokens: { accessToken, refreshToken },
      user: { id: user?._id, email: user?.email, role: user?.role },
    },
  });
});

// refresh token
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token Refreshed Successfully',
    data: result,
  });
});

// forget password
const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authServices.forgetPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Click The Link To Reset Your Password',
    data: result,
  });
});
export const authControllers = {
  loginUser,
  refreshToken,
  forgetPassword,
};
