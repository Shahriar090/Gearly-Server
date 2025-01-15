import { Request, Response } from 'express';
import { userServices } from './user.services';

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createAdminIntoDb(req.body.admin);
    if (result) {
      res.status(201).json({
        message: 'Admin Created Successfully',
        data: result,
      });
    } else {
      return res.status(400).json({
        message: 'Failed To Create Admin',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: 'An unexpected error occurred. Please try again later.',
    });
  }
};

export const userControllers = { createAdmin };
