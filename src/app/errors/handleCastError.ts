import type mongoose from 'mongoose';
import type { TErrorSource, TGenericErrorResponse } from '../globalInterface/error';

const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
	const errorSource: TErrorSource = [
		{
			path: err.path,
			message: err.message,
		},
	];

	const statusCode = 400;
	return {
		statusCode,
		message: 'Invalid ID',
		errorSource,
	};
};

export default handleCastError;
