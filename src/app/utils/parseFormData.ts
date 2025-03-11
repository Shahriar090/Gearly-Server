import { Request, Response, NextFunction } from 'express';

export const parseFormData = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data); // Parse JSON string
    }
    next(); // Move to the next middleware or route handler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Send the error response without returning it
    res.status(400).json({
      success: false,
      message: 'Invalid JSON data in form-data',
      error: error.message,
    });
  }
};
