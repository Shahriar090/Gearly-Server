import { Request, Response } from 'express';
import { userServices } from './user.services';

// create user
const createUser = async (req: Request, res: Response) => {
  const result = await userServices.createUserIntoDb(req.body);
  if (result) {
    res.status(201).json({
      message: 'User Created Successfully',
      data: result,
    });
  } else {
    res.status(400).json({
      message: 'User Creating Filed',
    });
  }
};

// get all users
const getAllUsers = async (req: Request, res: Response) => {
  const result = await userServices.getAllUsersFromDb();
  if (result) {
    res.status(201).json({
      message: 'All Users Retrieved Successfully',
      data: result,
    });
  } else {
    res.status(400).json({
      message: 'Users Retrieving Failed.!',
    });
  }
};

// get single user
const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.getSingleUserFromDb(id);

  if (result) {
    res.status(201).json({
      message: 'User Retrieved Successfully',
      data: result,
    });
  } else {
    res.status(400).json({
      message: 'User Retrieve Failed',
    });
  }
};

export const userControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
};
