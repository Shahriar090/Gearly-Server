import { ErrorRequestHandler } from 'express';

const globalErrorHandler: ErrorRequestHandler = (err, req, res) => {
  //   console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something Went Wrong.!👎';

  res.status(statusCode).json({
    success: false,
    message,
    error: err,
  });
};

export default globalErrorHandler;
