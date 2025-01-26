import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from '../globalInterface/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSource: TErrorSource = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
      path: val?.path,
      message: val?.message,
    }),
  );

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSource,
  };
};

export default handleValidationError;
