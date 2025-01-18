import { userServices } from './user.services';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import asyncHandler from '../../utils/asyncHandler';

// create user
const createUser = asyncHandler(async (req, res) => {
  const result = await userServices.createUserIntoDb(req.body);
  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'User Created Successfully',
      data: result,
    });
  } else {
    res.status(httpStatus.BAD_REQUEST).json({
      message: 'User Creating Filed',
    });
  }
});

// get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userServices.getAllUsersFromDb();
  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Users Retrieved Successfully',
      data: result,
    });
  } else {
    res.status(httpStatus.NOT_FOUND).json({
      message: 'Users Retrieving Failed. No Users Found.!',
    });
  }
});

// get single user
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.getSingleUserFromDb(id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Retrieved Successfully',
      data: result,
    });
  } else {
    res.status(httpStatus.NOT_FOUND).json({
      message: 'User Retrieve Failed. User Not Found.!',
    });
  }
});

// update a user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  const result = await userServices.updateUserIntoDb(id, userData);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Information Updated Successfully',
      data: result,
    });
  } else {
    res.status(httpStatus.NOT_FOUND).json({
      message: 'Failed To Update User Information.!',
    });
  }
});

// delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.deleteUserFromDb(id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Deleted Successfully',
      data: result,
    });
  } else {
    res.status(httpStatus.NOT_FOUND).json({
      message: 'User Delete Operation Failed.!',
    });
  }
});

export const userControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
