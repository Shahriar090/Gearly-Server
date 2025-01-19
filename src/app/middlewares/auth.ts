import config from '../config';
import { verifyJwtToken } from '../modules/auth/auth.utils';
import { UserRoles } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import asyncHandler from '../utils/asyncHandler';
import { JwtPayload } from 'jsonwebtoken';

const auth = (...requiredRoles: UserRoles[]) => {
  return asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new Error('You Are Unauthorized. No Token Found.!');
    }

    // verify the token
    const decoded = verifyJwtToken(token, config.access_token_secret as string);
    const { role, email } = decoded;

    // check if the user is exists or not
    const user = await User.isUserExists(email);

    if (!user) {
      throw new Error('This User Does Not Exist.!');
    }

    // check if the user is deleted
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new Error('No User Found. This User Is Deleted.!');
    }

    // check if the user is blocked
    const userStatus = user?.status;

    if (userStatus === 'Blocked') {
      throw new Error('This User Is Blocked.!');
    }

    if (requiredRoles && !requiredRoles.includes(role as UserRoles)) {
      throw new Error('You Are Not Authorized.!');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
