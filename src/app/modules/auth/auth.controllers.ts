import httpStatus from 'http-status';
import config from '../../config';
import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.services';

const loginUser = asyncHandler(async (req, res) => {
	const result = await authServices.loginUser(req.body);
	const { accessToken, refreshToken, user } = result;

	// HTTP only cookie for refresh token
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: config.node_env === 'production',
		sameSite: config.node_env === 'production' ? 'none' : 'lax',
		path: '/',
		maxAge: 7 * 24 * 60 * 60 * 1000, //7days
	});
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'User Login Successful.',
		data: {
			tokens: { accessToken },
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

// reset password
const resetPassword = asyncHandler(async (req, res) => {
	const token = req.headers.authorization || '';
	const result = await authServices.resetPassword(token, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Password Reset Successfully',
		data: result,
	});
});

export const authControllers = {
	loginUser,
	refreshToken,
	forgetPassword,
	resetPassword,
};
