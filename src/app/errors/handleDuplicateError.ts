import type { TErrorSource, TGenericErrorResponse } from '../globalInterface/error';

// type TDuplicateError = {
//   message: string;
//   code: number;
// };

const handleDuplicateError = (err: unknown): TGenericErrorResponse => {
	const errorMessage = err instanceof Error ? err.message : 'An Unknown Error Occured';
	const match = errorMessage.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
	const extractedMsg = match?.[1];
	const errorSource: TErrorSource = [
		{
			path: '',
			message: `${extractedMsg} Is Already Exist`,
		},
	];
	const statusCode = 400;
	return {
		statusCode,
		message: 'Duplicate Error',
		errorSource,
	};
};

export default handleDuplicateError;
