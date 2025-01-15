import { NextFunction, Request, Response } from 'express';
import { userServices } from './user.services';

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.createAdminIntoDb(req.body.admin);
    if (result) {
      res.status(201).json({
        message: 'Admin Created Successfully',
        data: result,
      });
    } else {
      res.status(400).json({
        message: 'Failed To Create Admin',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const userControllers = { createAdmin };
