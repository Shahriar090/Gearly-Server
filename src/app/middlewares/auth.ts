import config from '../config';
import { verifyJwtToken } from '../modules/auth/auth.utils';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import asyncHandler from '../utils/asyncHandler';
import { JwtPayload } from 'jsonwebtoken';

const auth = (...requiredRoles: TUserRole[]) => {
  return asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new Error('You Are Unauthorized. No Token Found.!');
    }

    // verify the token
    const decoded = verifyJwtToken(
      token,
      config.access_token_secret as string,
    ) as JwtPayload;

    const { role, email } = decoded;

    if (!decoded || !('email' in decoded)) {
      throw new Error('Invalid Token.');
    }

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

    if (
      requiredRoles.length > 0 &&
      !requiredRoles.includes(role as TUserRole)
    ) {
      throw new Error('You Are Not Authorized.!');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
