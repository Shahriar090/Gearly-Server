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

// get single user
const getSingleUserFromDb = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new Error('No User Found With This Id.!');
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

export const userServices = {
  createUserIntoDb,
  getAllUsersFromDb,
  getSingleUserFromDb,
  updateUserIntoDb,
};
