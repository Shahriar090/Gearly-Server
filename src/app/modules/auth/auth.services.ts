import config from '../../config';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { generateJwtToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
  // check if the user is exists or not
  const user = await User.isUserExists(payload.email);
  if (!user) {
    throw new Error('User Not Found');
  }

  // check if the user is blocked
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

export const authServices = {
  loginUser,
};
