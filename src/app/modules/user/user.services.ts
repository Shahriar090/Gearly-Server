import { IUser } from './user.interface';
import { User } from './user.model';

// create user
const createUserIntoDb = async (payload: IUser) => {
  const isUserExist = await User.isUserExists(payload.email);
  if (isUserExist) {
    throw new Error('User With This Email Already Exists.!');
  }
  const result = await User.create(payload);
  return result;
};

// get all users
const getAllUsersFromDb = async () => {
  const result = await User.find();
  return result;
};

export const userServices = {
  createUserIntoDb,
  getAllUsersFromDb,
};
