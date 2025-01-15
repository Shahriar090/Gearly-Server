import { Request, Response } from 'express';
import { userServices } from './user.services';

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

export const userControllers = {
  createUser,
};
