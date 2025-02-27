import { TErrorSource, TGenericErrorResponse } from '../globalInterface/error';

// type TDuplicateError = {
//   message: string;
//   code: number;
// };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const extractedMsg = match && match[1];
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
