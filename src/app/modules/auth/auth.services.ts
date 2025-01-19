import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

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
};

export const authServices = {
  loginUser,
};
