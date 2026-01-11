import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import AppError from '../errors/appError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import type { TErrorSource } from '../globalInterface/error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	console.log('Global error handler triggered');
	console.error(err.stack);
	let statusCode = err.statusCode || 500;
	let message = err.message || 'Something Went Wrong';

	let errorSource: TErrorSource = [
		{
			path: '',
			message: 'Something Went Wrong',
		},
	];

	if (err instanceof ZodError) {
		const simplifiedError = handleZodError(err);
		statusCode = simplifiedError?.statusCode;
		message = simplifiedError?.message;
		errorSource = simplifiedError?.errorSource;
	} else if (err?.name === 'ValidationError') {
		const simplifiedError = handleValidationError(err);
		statusCode = simplifiedError?.statusCode;
		message = simplifiedError?.message;
		errorSource = simplifiedError?.errorSource;
	} else if (err?.name === 'CastError') {
		const simplifiedError = handleCastError(err);
		statusCode = simplifiedError?.statusCode;
		message = simplifiedError?.message;
		errorSource = simplifiedError?.errorSource;
	} else if (err?.code === 11000) {
		const simplifiedError = handleDuplicateError(err);
		statusCode = simplifiedError?.statusCode;
		message = simplifiedError?.message;
		errorSource = simplifiedError?.errorSource;
	} else if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;

		errorSource = [
			{
				path: '',
				message: err.message,
			},
		];
	} else if (err instanceof Error) {
		message = err.message;
		errorSource = [
			{
				path: '',
				message: err.message,
			},
		];
	}

	res.status(statusCode).json({
		success: false,
		message,
		errorSource,
		err,
		stack: config.node_env === 'development' ? err?.stack : null,
	});
};

export default globalErrorHandler;
