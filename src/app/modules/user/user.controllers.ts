import { userServices } from './user.services';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import asyncHandler from '../../utils/asyncHandler';

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

export const userControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
