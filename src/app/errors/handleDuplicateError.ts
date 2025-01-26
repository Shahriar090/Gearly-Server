import { TErrorSource, TGenericErrorResponse } from '../globalInterface/error';

// type TDuplicateError = {
//   message: string;
//   code: number;
// };

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
