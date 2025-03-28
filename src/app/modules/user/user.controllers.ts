import { userServices } from './user.services';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import asyncHandler from '../../utils/asyncHandler';
import { handleImageUpload } from '../../utils/sendImageToCloudinary';
import AppError from '../../errors/appError';

// create user
const createUser = asyncHandler(async (req, res) => {
  const result = await userServices.createUserIntoDb(req.body.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User Created Successfully',
    data: result,
  });
});

// get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userServices.getAllUsersFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Users Retrieved Successfully',
    data: result,
  });
});

// get single user
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.getSingleUserFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Retrieved Successfully',
    data: result,
  });
});

// update a user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userData = req.body.user;
  const result = await userServices.updateUserIntoDb(id, userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Information Updated Successfully',
    data: result,
  });
});

// delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.deleteUserFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Deleted Successfully',
    data: result,
  });
});

// get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const result = await userServices.getUserProfileFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Info Retrieved Successfully',
    data: result,
  });
});

// update profile image
const updateProfileImage = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const uploadedImageUrl = await handleImageUpload(req);

  if (!uploadedImageUrl) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Image Upload Failed',
      'ImageUploadError',
    );
  }
  const result = await userServices.updateProfilePicture(
    id,
    uploadedImageUrl as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile image updated successfully',
    data: {
      profileImage: result.profileImage,
      user: result.user,
    },
  });
});

export const userControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateProfileImage,
};
