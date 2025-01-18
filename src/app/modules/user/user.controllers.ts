import { NextFunction, Request, Response } from 'express';
import { userServices } from './user.services';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';

// create user
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// get all users
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// get single user
const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// update a user
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// delete a user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const userControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
