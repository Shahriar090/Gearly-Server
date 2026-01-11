import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import type { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/appError';
import { sendEmail } from '../../utils/sendEmail';
import { User } from '../user/user.model';
import type { TLoginUser } from './auth.interface';
import { generateJwtToken, verifyJwtToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
	// check if the user is exists or not
	const user = await User.isUserExists(payload.email);
	if (!user) {
		throw new Error('User Not Found');
	}

	// check if the user is deleted
	const isDeleted = user?.isDeleted;
	if (isDeleted) {
		throw new Error('This User Is Deleted.!');
	}

	// check if the user status is blocked
	const userStatus = user?.status;
	if (userStatus === 'Blocked') {
		throw new Error('This User Is Blocked.!');
	}

	// check if the hashed password matches with plain text password
	if (!(await User.isPasswordMatched(payload.password, user.password))) {
		throw new Error('Incorrect Password. Please Try Again.');
	}
	// generate access and refresh token
	const jwtPayload = {
		id: user?._id,
		email: user?.email,
		role: user?.role,
	};

	const accessToken = generateJwtToken(
		jwtPayload,
		config.access_token_secret as string,
		config.access_token_expiry as string,
	);

	const refreshToken = generateJwtToken(
		jwtPayload,
		config.refresh_token_secret as string,
		config.refresh_token_expiry as string,
	);

	return {
		accessToken,
		refreshToken,
		user,
	};
};

// refresh token
const refreshToken = async (token: string) => {
	// check if the token provided or not
	if (!token) {
		throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Authorized.!', 'UnauthorizedError');
	}

	// decoding token
	const decoded = verifyJwtToken(token, config.refresh_token_secret as string) as JwtPayload;
	const { email } = decoded;
	// check if the user is exist or not
	const user = await User.isUserExists(email);

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, 'User Not Found.!', 'UserNotFound');
	}

	// check if the user is deleted or not
	const isDeleted = user?.isDeleted;
	if (isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, 'This User Is Deleted.!', 'DeletedUser');
	}

	// check if the user is blocked or not
	const userStatus = user?.status;
	if (userStatus === 'Blocked') {
		throw new AppError(httpStatus.NOT_FOUND, 'This User Is Blocked.!', 'UserNotFound');
	}

	const jwtPayload = {
		id: user?._id,
		email: user?.email,
		role: user?.role,
	};

	const accessToken = generateJwtToken(
		jwtPayload,
		config.access_token_secret as string,
		config.access_token_expiry as string,
	);

	return {
		accessToken,
	};
};

// forget password
const forgetPassword = async (email: string) => {
	const user = await User.isUserExists(email);

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, 'No User Found With This Email.!', '');
	}

	// check if the user is deleted or blocked
	const isDeleted = user?.isDeleted;
	if (isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, 'This User Is Already Deleted', '');
	}

	const userStatus = user.status;
	if (userStatus === 'Blocked') {
		throw new AppError(httpStatus.FORBIDDEN, 'This User Is Blocked!', '');
	}

	const jwtPayload = {
		id: user?._id,
		email: user?.email,
		role: user?.role,
	};

	const resetToken = generateJwtToken(jwtPayload, config.access_token_secret as string, '10m');
	const resetPasswordLink = `${config.front_end_deployed_url as string}/reset-password?token=${resetToken}`;

	const emailInfo = {
		to: user.email,
		subject: 'Your Reset Password Link.',
		text: 'Please reset your password within 10 minutes.!',
		html: `<p>Click the link below to reset your password:</p>
    <a href="${resetPasswordLink}">${resetPasswordLink}</a>
    `,
	};

	await sendEmail(emailInfo.to, emailInfo.subject, emailInfo.text, emailInfo.html);
	return resetPasswordLink;
};

// reset password
const resetPassword = async (
	token: string,
	payload: {
		email: string;
		newPassword: string;
	},
) => {
	const decoded = verifyJwtToken(token, config.access_token_secret as string) as JwtPayload;

	if (!decoded || !decoded.email || !decoded.exp) {
		throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Or Expired Token', 'Unauthorized');
	}

	// check if the token has expired
	if (Date.now() >= decoded.exp * 1000) {
		throw new AppError(httpStatus.UNAUTHORIZED, 'Token Has Expired', 'Unauthorized');
	}

	const user = await User.isUserExists(payload.email);

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, 'No User Found With This Email', 'UserNotFound');
	}

	// Check if the user is deleted or blocked
	if (user.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, 'This User Has Been Deleted', '');
	}
	if (user.status === 'Blocked') {
		throw new AppError(httpStatus.FORBIDDEN, 'This User Is Blocked!', '');
	}

	// ensure token email matches the user email
	if (payload.email !== decoded.email) {
		throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Authorized', 'Unauthorized');
	}

	// hash the new password
	const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_round));

	// update user password
	await User.findOneAndUpdate(
		{ email: decoded.email, role: decoded.role },
		{
			$set: { password: newHashedPassword, passwordChangedAt: Date.now() },
		},
	);
};

export const authServices = {
	loginUser,
	refreshToken,
	forgetPassword,
	resetPassword,
};
