import config from '../config';
import AppError from '../errors/appError';
import { verifyJwtToken } from '../modules/auth/auth.utils';
import type { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import asyncHandler from '../utils/asyncHandler';
import { type JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import httpStatus from 'http-status';

const auth = (...requiredRoles: TUserRole[]) => {
	return asyncHandler(async (req, res, next) => {
		const token = req.headers.authorization;

		if (!token) {
			throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Unauthorized. No Token Found.!', 'NoToken');
		}

		let decoded: JwtPayload;

		try {
			decoded = verifyJwtToken(token, config.access_token_secret as string) as JwtPayload;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new AppError(httpStatus.UNAUTHORIZED, 'Your Token Has Expired. Please Login Again', 'JwtExpired');
			}
			throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Token', 'InvalidToken');
		}

		const { role, email } = decoded;

		// Check if user exists
		const user = await User.isUserExists(email);
		if (!user) {
			throw new AppError(httpStatus.NOT_FOUND, 'This User Does Not Exist.!', 'UserNotFound');
		}

		// Check if user is deleted
		if (user.isDeleted) {
			throw new AppError(httpStatus.NOT_FOUND, 'No User Found. This User Is Deleted.!', 'UserDeleted');
		}

		// Check if user is blocked
		if (user.status === 'Blocked') {
			throw new AppError(httpStatus.FORBIDDEN, 'This User Is Blocked.!', 'UserBlocked');
		}

		// Role check
		if (requiredRoles.length > 0 && !requiredRoles.includes(role as TUserRole)) {
			throw new AppError(httpStatus.FORBIDDEN, 'You Are Not Authorized.!', 'UnauthorizedRole');
		}

		req.user = decoded as JwtPayload;
		next();
	});
};

export default auth;
