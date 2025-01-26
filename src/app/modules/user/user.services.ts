import AppError from '../../errors/appError';
import { IUser } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status';

// create user
const createUserIntoDb = async (payload: IUser) => {
  const isUserExist = await User.isUserExists(payload.email);
  if (isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This User Is Already Exists.!',
      'UserAlreadyExists',
    );
  }
  const result = await User.create(payload);
  return result;
};

// get all users
const getAllUsersFromDb = async () => {
  const result = await User.find();
  return result;
};

// get single user
const getSingleUserFromDb = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No User Found With This Id.!',
      'UserNotFound',
    );
  }
  return result;
};

// update a user
const updateUserIntoDb = async (id: string, payload: IUser) => {
  // separating primitive and non primitive data
  const { name, ...remainingUserData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingUserData,
  };

  if (name && typeof name === 'object' && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      // dot notation for updating nested fields in MongoDB
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await User.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  });

  return result;
};

// delete a user
const deleteUserFromDb = async (id: string) => {
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No User Found With This Id.!',
      'UserNotFound',
    );
  }
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const userServices = {
  createUserIntoDb,
  getAllUsersFromDb,
  getSingleUserFromDb,
  updateUserIntoDb,
  deleteUserFromDb,
};
