import type { ZodError, ZodIssue } from 'zod';
import type { TErrorSource, TGenericErrorResponse } from '../globalInterface/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
	const errorSource: TErrorSource = err.issues.map((issue: ZodIssue) => ({
		path: issue?.path[issue.path.length - 1],
		message: issue.message,
	}));
	const statusCode = 400;

	return {
		statusCode,
		message: 'Validation Error',
		errorSource,
	};
};

export default handleZodError;
