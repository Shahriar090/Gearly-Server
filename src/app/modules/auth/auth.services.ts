import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { generateJwtToken, verifyJwtToken } from './auth.utils';
import httpStatus from 'http-status';
import { sendEmail } from '../../utils/sendEmail';

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

// refresh token
const refreshToken = async (token: string) => {
  // check if the token provided or not
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You Are Not Authorized.!',
      'UnauthorizedError',
    );
  }

  // decoding token
  const decoded = verifyJwtToken(
    token,
    config.refresh_token_secret as string,
  ) as JwtPayload;
  const { email } = decoded;
  // check if the user is exist or not
  const user = await User.isUserExists(email);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User Not Found.!',
      'UserNotFound',
    );
  }

  // check if the user is deleted or not
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This User Is Deleted.!',
      'DeletedUser',
    );
  }

  // check if the user is blocked or not
  const userStatus = user?.status;
  if (userStatus === 'Blocked') {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This User Is Blocked.!',
      'UserNotFound',
    );
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
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No User Found With This Email.!',
      '',
    );
  }

  // check if the user is deleted or blocked
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This User Is Already Deleted',
      '',
    );
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

  const resetToken = generateJwtToken(
    jwtPayload,
    config.access_token_secret as string,
    '10m',
  );
  const resetPasswordLink = `${config.front_end_url}/reset-password?token=${resetToken}`;

  const emailInfo = {
    to: user.email,
    subject: 'Your Reset Password Link.',
    text: 'Please reset your password within 10 minutes.!',
    html: `<p>Click the link below to reset your password:</p>
    <a href="${resetPasswordLink}">${resetPasswordLink}</a>
    `,
  };

  await sendEmail(
    emailInfo.to,
    emailInfo.subject,
    emailInfo.text,
    emailInfo.html,
  );
  return resetPasswordLink;
};

export const authServices = {
  loginUser,
  refreshToken,
  forgetPassword,
};
