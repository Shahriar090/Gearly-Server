import AppError from '../../errors/appError';
import { IUser } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../config';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

// create user
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createUserIntoDb = async (payload: IUser, file: any) => {
  const isUserExist = await User.isUserExists(payload.email);
  if (isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      'User Already Exists With This Email.!',
      'UserAlreadyExists',
    );
  }

  if (file) {
    const imageName = `${payload.name.firstName}`;
    const imagePath = file.path;

    // send image to cloudinary
    const categoryImage = await sendImageToCloudinary(imageName, imagePath);
    const { secure_url } = categoryImage;
    payload.profileImage = secure_url as string;
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

  // hash the password if password being updated
  if (payload.password) {
    modifiedUpdatedData.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_round),
    );
  }
  if (name && typeof name === 'object' && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      // dot notation for updating nested fields in MongoDB
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await User.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User Not Found',
      'UserNotFoundError',
    );
  }
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

// my profile
const getUserProfileFromDb = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'No User Found', 'NoUserFound');
  }

  return user;
};

export const userServices = {
  createUserIntoDb,
  getAllUsersFromDb,
  getSingleUserFromDb,
  updateUserIntoDb,
  deleteUserFromDb,
  getUserProfileFromDb,
};
